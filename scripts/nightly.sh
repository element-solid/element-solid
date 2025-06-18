sed -i 's/"name": "element-solid",/"name": "@element-solid\/nightly",/' packages/element-solid/package.json
sed -i '2s/element-solid/@element-solid\/nightly/' internal/build-constants/src/pkg.ts