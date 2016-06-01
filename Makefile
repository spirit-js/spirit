COLOR = \033[1;33m
COLOR_RESET = \033[0m

default: build

bench: build
	@go run benchmarks/runner.go

build:
	@echo "Building src..."
	@node_modules/.bin/babel src -d lib

watch:
	@echo "Auto building..."
	node_modules/.bin/babel src -d lib

test: build
	@echo "\n$(COLOR)Running tests...$(COLOR_RESET)"
	@node_modules/.bin/jasmine ${file}
	@echo "\n"

.PHONY: default build test watch bench
