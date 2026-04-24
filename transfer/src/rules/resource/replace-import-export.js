export const test = /\.js$|\.ts$/;

export default (ast) => {
    ast.replace(`import Resource from $$$`, `import {create, CustomResource} from '@yqg/resource'`);
    ast.replace(`export default Resource.create(api);`, `export default create(api) as CustomResource<typeof api>;`);
    return ast;
};
