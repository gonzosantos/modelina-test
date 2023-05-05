"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.validate = exports.validationFlags = exports.convertToOldAPI = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const cjs_1 = require("@asyncapi/parser/cjs");
Object.defineProperty(exports, "convertToOldAPI", { enumerable: true, get: function () { return cjs_1.convertToOldAPI; } });
const avro_schema_parser_1 = require("@asyncapi/avro-schema-parser");
const openapi_schema_parser_1 = require("@asyncapi/openapi-schema-parser");
const raml_dt_schema_parser_1 = require("@asyncapi/raml-dt-schema-parser");
const spectral_core_1 = require("@stoplight/spectral-core");
const formatters_1 = require("@stoplight/spectral-cli/dist/formatters");
const config_1 = require("@stoplight/spectral-cli/dist/services/config");
const parser = new cjs_1.Parser({
    __unstable: {
        resolver: {
            cache: false,
        }
    }
});
parser.registerSchemaParser((0, avro_schema_parser_1.AvroSchemaParser)());
parser.registerSchemaParser((0, openapi_schema_parser_1.OpenAPISchemaParser)());
parser.registerSchemaParser((0, raml_dt_schema_parser_1.RamlDTSchemaParser)());
function validationFlags({ logDiagnostics = true } = {}) {
    return {
        'log-diagnostics': core_1.Flags.boolean({
            description: 'log validation diagnostics or not',
            default: logDiagnostics,
            allowNo: true,
        }),
        'diagnostics-format': core_1.Flags.enum({
            description: 'format to use for validation diagnostics',
            options: Object.values(config_1.OutputFormat),
            default: config_1.OutputFormat.STYLISH,
        }),
        'fail-severity': core_1.Flags.enum({
            description: 'diagnostics of this level or above will trigger a failure exit code',
            options: ['error', 'warn', 'info', 'hint'],
            default: 'error',
        }),
    };
}
exports.validationFlags = validationFlags;
function validate(command, specFile, options = {}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const diagnostics = yield parser.validate(specFile.text(), { source: specFile.getSource() });
        return logDiagnostics(diagnostics, command, specFile, options);
    });
}
exports.validate = validate;
function parse(command, specFile, options = {}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { document, diagnostics } = yield parser.parse(specFile.text(), { source: specFile.getSource() });
        const status = logDiagnostics(diagnostics, command, specFile, options);
        return { document, diagnostics, status };
    });
}
exports.parse = parse;
function logDiagnostics(diagnostics, command, specFile, options = {}) {
    var _a, _b;
    const logDiagnostics = options['log-diagnostics'];
    const failSeverity = (_a = options['fail-severity']) !== null && _a !== void 0 ? _a : 'error';
    const diagnosticsFormat = (_b = options['diagnostics-format']) !== null && _b !== void 0 ? _b : 'stylish';
    const sourceString = specFile.toSourceString();
    if (diagnostics.length) {
        if (hasFailSeverity(diagnostics, failSeverity)) {
            if (logDiagnostics) {
                command.logToStderr(`\n${sourceString} and/or referenced documents have governance issues.`);
                command.logToStderr(formatOutput(diagnostics, diagnosticsFormat, failSeverity));
            }
            command.exit(1);
            return 'invalid';
        }
        if (logDiagnostics) {
            command.log(`\n${sourceString} is valid but has (itself and/or referenced documents) governance issues.`);
            command.log(formatOutput(diagnostics, diagnosticsFormat, failSeverity));
        }
    }
    else if (logDiagnostics) {
        command.log(`\n${sourceString} is valid! ${sourceString} and referenced documents don't have governance issues.`);
    }
    return 'valid';
}
function formatOutput(diagnostics, format, failSeverity) {
    const options = { failSeverity: (0, spectral_core_1.getDiagnosticSeverity)(failSeverity) };
    switch (format) {
        case 'stylish': return (0, formatters_1.stylish)(diagnostics, options);
        case 'json': return (0, formatters_1.json)(diagnostics, options);
        case 'junit': return (0, formatters_1.junit)(diagnostics, options);
        case 'html': return (0, formatters_1.html)(diagnostics, options);
        case 'text': return (0, formatters_1.text)(diagnostics, options);
        case 'teamcity': return (0, formatters_1.teamcity)(diagnostics, options);
        case 'pretty': return (0, formatters_1.pretty)(diagnostics, options);
        default: return (0, formatters_1.stylish)(diagnostics, options);
    }
}
function hasFailSeverity(diagnostics, failSeverity) {
    const diagnosticSeverity = (0, spectral_core_1.getDiagnosticSeverity)(failSeverity);
    return diagnostics.some(diagnostic => diagnostic.severity <= diagnosticSeverity);
}
