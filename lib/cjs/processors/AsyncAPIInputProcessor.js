"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncAPIInputProcessor = void 0;
const parser_1 = require("@asyncapi/parser");
const utils_1 = require("@asyncapi/parser/cjs/utils");
const AbstractInputProcessor_1 = require("./AbstractInputProcessor");
const JsonSchemaInputProcessor_1 = require("./JsonSchemaInputProcessor");
const models_1 = require("../models");
const utils_2 = require("../utils");
const AsyncapiV2Schema_1 = require("../models/AsyncapiV2Schema");
const helpers_1 = require("../helpers");
/**
 * Class for processing AsyncAPI inputs
 */
class AsyncAPIInputProcessor extends AbstractInputProcessor_1.AbstractInputProcessor {
    constructor() {
        super(...arguments);
        this.parser = new parser_1.Parser();
    }
    /**
     * Process the input as an AsyncAPI document
     *
     * @param input
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    process(input, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.shouldProcess(input)) {
                throw new Error('Input is not an AsyncAPI document so it cannot be processed.');
            }
            utils_2.Logger.debug('Processing input as an AsyncAPI document');
            let doc;
            const inputModel = new models_1.InputMetaModel();
            if (!AsyncAPIInputProcessor.isFromParser(input)) {
                const { document, diagnostics } = yield this.parser.parse(input, (options === null || options === void 0 ? void 0 : options.asyncapi) || {});
                if (document) {
                    doc = document;
                }
                else {
                    const err = new Error('Input is not an correct AsyncAPI document so it cannot be processed.');
                    err.diagnostics = diagnostics;
                    throw err;
                }
            }
            else if (AsyncAPIInputProcessor.isFromNewParser(input)) {
                doc = input;
            }
            else {
                // Is from old parser
                const parsedJSON = input.json();
                const detailed = (0, utils_1.createDetailedAsyncAPI)(parsedJSON, parsedJSON);
                doc = (0, parser_1.createAsyncAPIDocument)(detailed);
            }
            inputModel.originalInput = doc;
            // Go over all the message payloads and convert them to models
            for (const message of doc.allMessages()) {
                const payload = message.payload();
                if (payload) {
                    const schema = AsyncAPIInputProcessor.convertToInternalSchema(payload);
                    const newCommonModel = JsonSchemaInputProcessor_1.JsonSchemaInputProcessor.convertSchemaToCommonModel(schema, options);
                    if (newCommonModel.$id !== undefined) {
                        if (inputModel.models[newCommonModel.$id] !== undefined) {
                            utils_2.Logger.warn(`Overwriting existing model with $id ${newCommonModel.$id}, are there two models with the same id present?`, newCommonModel);
                        }
                        const metaModel = (0, helpers_1.convertToMetaModel)(newCommonModel);
                        inputModel.models[metaModel.name] = metaModel;
                    }
                    else {
                        utils_2.Logger.warn('Model did not have $id which is required, ignoring.', newCommonModel);
                    }
                }
            }
            return inputModel;
        });
    }
    /**
     *
     * Reflect the name of the schema and save it to `x-modelgen-inferred-name` extension.
     *
     * This keeps the the id of the model deterministic if used in conjunction with other AsyncAPI tools such as the generator.
     *
     * @param schema to reflect name for
     */
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    static convertToInternalSchema(schema, alreadyIteratedSchemas = new Map()) {
        if (typeof schema === 'boolean') {
            return schema;
        }
        let schemaUid = schema.id();
        //Because the constraint functionality of generators cannot handle -, <, >, we remove them from the id if it's an anonymous schema.
        if (typeof schemaUid !== 'undefined' &&
            schemaUid.includes('<anonymous-schema')) {
            schemaUid = schemaUid
                .replace('<', '')
                .replace(/-/g, '_')
                .replace('>', '');
        }
        if (alreadyIteratedSchemas.has(schemaUid)) {
            return alreadyIteratedSchemas.get(schemaUid);
        }
        const convertedSchema = Object.assign(new AsyncapiV2Schema_1.AsyncapiV2Schema(), schema.json());
        convertedSchema[this.MODELGEN_INFFERED_NAME] = schemaUid;
        alreadyIteratedSchemas.set(schemaUid, convertedSchema);
        if (schema.allOf()) {
            convertedSchema.allOf = schema
                .allOf()
                .map((item) => this.convertToInternalSchema(item, alreadyIteratedSchemas));
        }
        if (schema.oneOf()) {
            convertedSchema.oneOf = schema
                .oneOf()
                .map((item) => this.convertToInternalSchema(item, alreadyIteratedSchemas));
        }
        if (schema.anyOf()) {
            convertedSchema.anyOf = schema
                .anyOf()
                .map((item) => this.convertToInternalSchema(item, alreadyIteratedSchemas));
        }
        if (schema.not()) {
            convertedSchema.not = this.convertToInternalSchema(schema.not(), alreadyIteratedSchemas);
        }
        if (typeof schema.additionalItems() === 'object' &&
            schema.additionalItems() !== null) {
            convertedSchema.additionalItems = this.convertToInternalSchema(schema.additionalItems(), alreadyIteratedSchemas);
        }
        if (schema.contains()) {
            convertedSchema.contains = this.convertToInternalSchema(schema.contains(), alreadyIteratedSchemas);
        }
        if (schema.propertyNames()) {
            convertedSchema.propertyNames = this.convertToInternalSchema(schema.propertyNames(), alreadyIteratedSchemas);
        }
        if (schema.if()) {
            convertedSchema.if = this.convertToInternalSchema(schema.if(), alreadyIteratedSchemas);
        }
        if (schema.then()) {
            convertedSchema.then = this.convertToInternalSchema(schema.then(), alreadyIteratedSchemas);
        }
        if (schema.else()) {
            convertedSchema.else = this.convertToInternalSchema(schema.else(), alreadyIteratedSchemas);
        }
        if (typeof schema.additionalProperties() === 'object' &&
            schema.additionalProperties() !== null) {
            convertedSchema.additionalProperties = this.convertToInternalSchema(schema.additionalProperties(), alreadyIteratedSchemas);
        }
        if (schema.items()) {
            if (Array.isArray(schema.items())) {
                convertedSchema.items = schema.items().map((item) => this.convertToInternalSchema(item), alreadyIteratedSchemas);
            }
            else {
                convertedSchema.items = this.convertToInternalSchema(schema.items(), alreadyIteratedSchemas);
            }
        }
        const schemaProperties = schema.properties();
        if (schemaProperties && Object.keys(schemaProperties).length) {
            const properties = {};
            for (const [propertyName, propertySchema] of Object.entries(schemaProperties)) {
                properties[String(propertyName)] = this.convertToInternalSchema(propertySchema, alreadyIteratedSchemas);
            }
            convertedSchema.properties = properties;
        }
        const schemaDependencies = schema.dependencies();
        if (schemaDependencies && Object.keys(schemaDependencies).length) {
            const dependencies = {};
            for (const [dependencyName, dependency] of Object.entries(schemaDependencies)) {
                if (typeof dependency === 'object' && !Array.isArray(dependency)) {
                    dependencies[String(dependencyName)] = this.convertToInternalSchema(dependency, alreadyIteratedSchemas);
                }
                else {
                    dependencies[String(dependencyName)] = dependency;
                }
            }
            convertedSchema.dependencies = dependencies;
        }
        const schemaPatternProperties = schema.patternProperties();
        if (schemaPatternProperties &&
            Object.keys(schemaPatternProperties).length) {
            const patternProperties = {};
            for (const [patternPropertyName, patternProperty] of Object.entries(schemaPatternProperties)) {
                patternProperties[String(patternPropertyName)] =
                    this.convertToInternalSchema(patternProperty, alreadyIteratedSchemas);
            }
            convertedSchema.patternProperties = patternProperties;
        }
        const schemaDefinitions = schema.definitions();
        if (schemaDefinitions && Object.keys(schemaDefinitions).length) {
            const definitions = {};
            for (const [definitionName, definition] of Object.entries(schemaDefinitions)) {
                definitions[String(definitionName)] = this.convertToInternalSchema(definition, alreadyIteratedSchemas);
            }
            convertedSchema.definitions = definitions;
        }
        return convertedSchema;
    }
    /**
     * Figures out if an object is of type AsyncAPI document
     *
     * @param input
     */
    shouldProcess(input) {
        if (!input) {
            return false;
        }
        const version = this.tryGetVersionOfDocument(input);
        if (!version) {
            return false;
        }
        return AsyncAPIInputProcessor.supportedVersions.includes(version);
    }
    /**
     * Try to find the AsyncAPI version from the input. If it cannot undefined are returned, if it can, the version is returned.
     *
     * @param input
     */
    tryGetVersionOfDocument(input) {
        if (!input) {
            return;
        }
        if (AsyncAPIInputProcessor.isFromParser(input)) {
            return input.version();
        }
        return input && input.asyncapi;
    }
    /**
     * Figure out if input is from the AsyncAPI parser.
     *
     * @param input
     */
    static isFromParser(input) {
        return (0, parser_1.isOldAsyncAPIDocument)(input) || this.isFromNewParser(input);
    }
    /**
     * Figure out if input is from the new AsyncAPI parser.
     *
     * @param input
     */
    static isFromNewParser(input) {
        return (0, parser_1.isAsyncAPIDocument)(input);
    }
}
exports.AsyncAPIInputProcessor = AsyncAPIInputProcessor;
AsyncAPIInputProcessor.supportedVersions = [
    '2.0.0',
    '2.1.0',
    '2.2.0',
    '2.3.0',
    '2.4.0',
    '2.5.0',
    '2.6.0'
];
//# sourceMappingURL=AsyncAPIInputProcessor.js.map