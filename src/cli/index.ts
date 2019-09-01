#!/usr/bin/env node
import { main } from './app'

main(process.argv).then(exitCode => process.exit(exitCode))
