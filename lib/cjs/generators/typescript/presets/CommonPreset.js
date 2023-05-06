"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TS_COMMON_PRESET = void 0;
const models_1 = require("../../../models");
const ExampleFunction_1 = __importDefault(require("./utils/ExampleFunction"));
function realizePropertyFactory(prop) {
    return `$\{typeof ${prop} === 'number' || typeof ${prop} === 'boolean' ? ${prop} : JSON.stringify(${prop})}`;
}
function renderMarshalProperty(modelInstanceVariable, model) {
    if (model instanceof models_1.ConstrainedReferenceModel &&
        !(model.ref instanceof models_1.ConstrainedEnumModel)) {
        return `$\{${modelInstanceVariable}.marshal()}`;
    }
    return realizePropertyFactory(modelInstanceVariable);
}
function renderUnionSerializationArray(modelInstanceVariable, prop, unconstrainedProperty, unionModel) {
    const propName = `${prop}JsonValues`;
    const allUnionReferences = unionModel.union
        .filter((model) => {
        return (model instanceof models_1.ConstrainedReferenceModel &&
            !(model.ref instanceof models_1.ConstrainedEnumModel));
    })
        .map((model) => {
        return `unionItem instanceof ${model.type}`;
    });
    const allUnionReferencesCondition = allUnionReferences.join(' || ');
    const hasUnionReference = allUnionReferences.length > 0;
    let unionSerialization = `${propName}.push(typeof unionItem === 'number' || typeof unionItem === 'boolean' ? unionItem : JSON.stringify(unionItem))`;
    if (hasUnionReference) {
        unionSerialization = `if(${allUnionReferencesCondition}) {
      ${propName}.push(unionItem.marshal());
    } else {
      ${propName}.push(typeof unionItem === 'number' || typeof unionItem === 'boolean' ? unionItem : JSON.stringify(unionItem))
    }`;
    }
    return `let ${propName}: any[] = [];
  for (const unionItem of ${modelInstanceVariable}) {
    ${unionSerialization}
  }
  json += \`"${unconstrainedProperty}": [\${${propName}.join(',')}],\`;`;
}
function renderArraySerialization(modelInstanceVariable, prop, unconstrainedProperty, arrayModel) {
    const propName = `${prop}JsonValues`;
    return `let ${propName}: any[] = [];
  for (const unionItem of ${modelInstanceVariable}) {
    ${propName}.push(\`${renderMarshalProperty('unionItem', arrayModel.valueModel)}\`);
  }
  json += \`"${unconstrainedProperty}": [\${${propName}.join(',')}],\`;`;
}
function renderUnionSerialization(modelInstanceVariable, unconstrainedProperty, unionModel) {
    const allUnionReferences = unionModel.union
        .filter((model) => {
        return (model instanceof models_1.ConstrainedReferenceModel &&
            !(model.ref instanceof models_1.ConstrainedEnumModel));
    })
        .map((model) => {
        return `${modelInstanceVariable} instanceof ${model.type}`;
    });
    const allUnionReferencesCondition = allUnionReferences.join(' || ');
    const hasUnionReference = allUnionReferences.length > 0;
    if (hasUnionReference) {
        return `if(${allUnionReferencesCondition}) {
    json += \`"${unconstrainedProperty}": $\{${modelInstanceVariable}.marshal()},\`;
  } else {
    json += \`"${unconstrainedProperty}": ${realizePropertyFactory(modelInstanceVariable)},\`;
  }`;
    }
    return `json += \`"${unconstrainedProperty}": ${realizePropertyFactory(modelInstanceVariable)},\`;`;
}
function renderMarshalProperties(model) {
    const properties = model.properties || {};
    const propertyKeys = [...Object.entries(properties)];
    //These are a bit special as 'unwrap' dictionary models means they have to be unwrapped within the JSON object.
    const unwrapDictionaryProperties = [];
    const normalProperties = [];
    for (const entry of propertyKeys) {
        if (entry[1].property instanceof models_1.ConstrainedDictionaryModel &&
            entry[1].property.serializationType === 'unwrap') {
            unwrapDictionaryProperties.push(entry);
        }
        else {
            normalProperties.push(entry);
        }
    }
    const marshalNormalProperties = normalProperties.map(([prop, propModel]) => {
        const modelInstanceVariable = `this.${prop}`;
        let marshalCode = '';
        if (propModel.property instanceof models_1.ConstrainedArrayModel &&
            propModel.property.valueModel instanceof models_1.ConstrainedUnionModel) {
            marshalCode = renderUnionSerializationArray(modelInstanceVariable, prop, propModel.unconstrainedPropertyName, propModel.property.valueModel);
        }
        else if (propModel.property instanceof models_1.ConstrainedUnionModel) {
            marshalCode = renderUnionSerialization(modelInstanceVariable, propModel.unconstrainedPropertyName, propModel.property);
        }
        else if (propModel.property instanceof models_1.ConstrainedArrayModel) {
            marshalCode = renderArraySerialization(modelInstanceVariable, prop, propModel.unconstrainedPropertyName, propModel.property);
        }
        else {
            const propMarshalCode = renderMarshalProperty(modelInstanceVariable, propModel.property);
            marshalCode = `json += \`"${propModel.unconstrainedPropertyName}": ${propMarshalCode},\`;`;
        }
        return `if(${modelInstanceVariable} !== undefined) {
  ${marshalCode} 
}`;
    });
    const marshalUnwrapDictionaryProperties = unwrapDictionaryProperties.map(([prop, propModel]) => {
        const modelInstanceVariable = 'value';
        const patternPropertyMarshalCode = renderMarshalProperty(modelInstanceVariable, propModel.property.value);
        const marshalCode = `json += \`"$\{key}": ${patternPropertyMarshalCode},\`;`;
        return `if(this.${prop} !== undefined) { 
for (const [key, value] of this.${prop}.entries()) {
  //Only unwrap those who are not already a property in the JSON object
  if(Object.keys(this).includes(String(key))) continue;
    ${marshalCode}
  }
}`;
    });
    return `
${marshalNormalProperties.join('\n')}
${marshalUnwrapDictionaryProperties.join('\n')}
`;
}
/**
 * Render `marshal` function based on model
 */
function renderMarshal({ renderer, model }) {
    return `public marshal() : string {
  let json = '{'
${renderer.indent(renderMarshalProperties(model))}
  //Remove potential last comma 
  return \`$\{json.charAt(json.length-1) === ',' ? json.slice(0, json.length-1) : json}}\`;
}`;
}
function renderUnmarshalProperty(modelInstanceVariable, model) {
    if (model instanceof models_1.ConstrainedReferenceModel &&
        !(model.ref instanceof models_1.ConstrainedEnumModel)) {
        return `${model.type}.unmarshal(${modelInstanceVariable})`;
    }
    return `${modelInstanceVariable}`;
}
function renderUnmarshalProperties(model) {
    const properties = model.properties || {};
    const propertyKeys = [...Object.entries(properties)];
    const propertyNames = propertyKeys.map(([name]) => {
        return name;
    });
    //These are a bit special as 'unwrap' dictionary models means they have to be unwrapped within the JSON object.
    const unwrapDictionaryProperties = [];
    const normalProperties = [];
    for (const entry of propertyKeys) {
        if (entry[1].property instanceof models_1.ConstrainedDictionaryModel &&
            entry[1].property.serializationType === 'unwrap') {
            unwrapDictionaryProperties.push(entry);
        }
        else {
            normalProperties.push(entry);
        }
    }
    const unmarshalNormalProperties = normalProperties.map(([prop, propModel]) => {
        const modelInstanceVariable = `obj["${propModel.unconstrainedPropertyName}"]`;
        const unmarshalCode = renderUnmarshalProperty(modelInstanceVariable, propModel.property);
        return `if (${modelInstanceVariable} !== undefined) {
  instance.${prop} = ${unmarshalCode};
}`;
    });
    const setDictionaryProperties = [];
    const unmarshalDictionaryProperties = [];
    for (const [prop, propModel] of unwrapDictionaryProperties) {
        const modelInstanceVariable = 'value as any';
        const unmarshalCode = renderUnmarshalProperty(modelInstanceVariable, propModel.property.value);
        setDictionaryProperties.push(`if (instance.${prop} === undefined) {instance.${prop} = new Map();}`);
        unmarshalDictionaryProperties.push(`instance.${prop}.set(key, ${unmarshalCode});`);
    }
    const corePropertyKeys = propertyNames
        .map((propertyKey) => `"${propertyKey}"`)
        .join(',');
    const unwrappedDictionaryCode = setDictionaryProperties.length > 0
        ? `${setDictionaryProperties.join('\n')}
  for (const [key, value] of Object.entries(obj).filter((([key,]) => {return ![${corePropertyKeys}].includes(key);}))) {
    ${unmarshalDictionaryProperties.join('\n')}
  }`
        : '';
    return `
${unmarshalNormalProperties.join('\n')}

${unwrappedDictionaryCode}
`;
}
/**
 * Render `unmarshal` function based on model
 */
function renderUnmarshal({ renderer, model }) {
    const unmarshalProperties = renderUnmarshalProperties(model);
    return `public static unmarshal(json: string | object): ${model.type} {
  const obj = typeof json === "object" ? json : JSON.parse(json);
  const instance = new ${model.type}({} as any);

${renderer.indent(unmarshalProperties)}
  return instance;
}`;
}
/**
 * Preset which adds `marshal`, `unmarshal`, `example` functions to class.
 *
 * @implements {TypeScriptPreset}
 */
exports.TS_COMMON_PRESET = {
    class: {
        additionalContent({ renderer, model, content, options }) {
            options = options || {};
            const blocks = [];
            if (options.marshalling === true) {
                blocks.push(renderMarshal({ renderer, model }));
                blocks.push(renderUnmarshal({ renderer, model }));
            }
            if (options.example === true) {
                blocks.push((0, ExampleFunction_1.default)({ model }));
            }
            return renderer.renderBlock([content, ...blocks], 2);
        }
    }
};
//# sourceMappingURL=CommonPreset.js.map