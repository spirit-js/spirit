package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"time"
)

type TestConfig struct {
	Status  int
	Headers []string
	Body    string
}

func errHandler(c *exec.Cmd, err ...interface{}) {
	c.Process.Signal(os.Interrupt)
	log.Fatal(err...)
}

func getTestData(dir string) (TestConfig, error) {
	var testCfg TestConfig

	data, err := ioutil.ReadFile(dir + "test.json")
	if err != nil {
		return testCfg, err
	}

	json.Unmarshal(data, &testCfg)
	return testCfg, nil
}

func testSetup(testCfg TestConfig, port string, c chan *exec.Cmd) *exec.Cmd {
	cmd := <-c
	time.Sleep(time.Second * 2)

	url := "http://localhost:" + port + "/"

	resp, err := http.Get(url)
	if err != nil {
		errHandler(cmd, err)
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		errHandler(cmd, err)
	}

	output := string(body[:len(body)])

	if resp.StatusCode != testCfg.Status {
		errHandler(cmd, "Failed benchmark status test | Got: ", resp.StatusCode, ", Expected:", testCfg.Status)
	}

	if output != testCfg.Body {
		errHandler(cmd, "Failed benchmark body test | Got: ", output, ", Expected:", testCfg.Body)
	}

	return cmd
}

func runBench(port string, file string) ([]byte, error) {
	args := []string{"http://localhost:" + port + "/", "-d 7", "-c 50", "-t 8"} //, "| grep 'Requests/sec'"}
	cmd := exec.Command("wrk", args...)
	output, err := cmd.Output()
	return output, err
}

func runSetup(file string, c chan *exec.Cmd) {
	cmd := exec.Command("node", file)
	c <- cmd
	err := cmd.Start()
	if err != nil {
		log.Fatal(err)
	}
}

/*
 * removes redudant first two lines of output from wrk:

Running 7s test @ http://localhost:3009/
  8 threads and 50 connections
*/
func prettyPrintResult(output []byte) string {
	b := bytes.Split(output, []byte("\n"))
	fmtb := bytes.Join(b[2:len(b)], []byte("\n"))
	return string(fmtb)
}

func getFilesFromDir(dir string) []string {
	files, err := ioutil.ReadDir(dir)
	if err != nil {
		log.Fatal(err)
	}

	rFiles := make([]string, 0)

	for _, f := range files {
		fn := f.Name()
		fnLen := len(fn) // check file extension
		if f.IsDir() == false && string(fn[fnLen-3:fnLen]) == ".js" {
			rFiles = append(rFiles, fn)
		}
	}

	return rFiles
}

func main() {
	port := "3009"

	dirList := []string{
		"benchmarks/setups/",
	}

	for _, dir := range dirList {
		testFiles := getFilesFromDir(dir)

		for _, f := range testFiles {
			file := dir + f
			fmt.Println("\n", "->", file)

			c := make(chan *exec.Cmd)

			// run the file (starts node server)
			go runSetup(file, c)

			// test the setup before benchmarking
			testdata, err := getTestData(dir)
			if err != nil {
				log.Fatal(err)
			}
			cmd := testSetup(testdata, port, c)

			// run benchmark
			output, err := runBench(port, file)
			if err != nil {
				errHandler(cmd, "wrk could not be run", err)
			}

			// filter output
			fmtOutput := prettyPrintResult(output)
			fmt.Println(string(fmtOutput))

			// clean up
			cmd.Process.Signal(os.Interrupt)
			err = cmd.Wait()
			if err.Error() == "signal: interrupt" {
				time.Sleep(time.Second * 2) // wait for system to release port
			} else {
				log.Fatal("unexpected error waiting on " + file + " to exit")
			}
		}
	}
}
