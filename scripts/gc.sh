#! /bin/bash

NAME=$(echo $1 | sed -E "s/([A-Z])/-\1/g" | sed -E "s/^-//g" | sed -E "s/_/-/g" | tr "A-Z" "a-z")

FILE_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")/../packages" && pwd)

re="[[:space:]]+"

if [ "$#" -ne 1 ] || [[ $NAME =~ $re ]] || [ "$NAME" == "" ]; then
  echo "Usage: pnpm gc \${name} with no space"
  exit 1
fi

DIRNAME="$FILE_PATH/components/$NAME"
INPUT_NAME=$NAME

if [ -d "$DIRNAME" ]; then
  echo "$NAME component already exists, please change it"
  exit 1
fi

NAME=$(echo $NAME | awk -F'-' '{ for(i=1; i<=NF; i++) { $i = toupper(substr($i,1,1)) tolower(substr($i,2)) } print $0 }' OFS='')
PROP_NAME=$(echo "${NAME:0:1}" | tr '[:upper:]' '[:lower:]')${NAME:1}

mkdir -p "$DIRNAME"
mkdir -p "$DIRNAME/src"
mkdir -p "$DIRNAME/style"
mkdir -p "$DIRNAME/__tests__"

cat > $DIRNAME/src/index.tsx <<EOF
import { Component, mergeProps} from 'solid-js';
import { useNamespace } from '@element-solid/hooks';
import { classNames } from '@element-solid/utils';
import { ${NAME}Props } from "./props";

const defaultProps: Partial<${NAME}Props> = {};

const ${NAME}: Component<${NAME}Props> = (_props) => {
  const props = mergeProps(defaultProps, _props);
  const ns = useNamespace('${NAME,,}');

  return <div class={classNames(ns.b())}></div>
}

export default ${NAME};

EOF

cat <<EOF >"$DIRNAME/src/props.ts"
import { JSX } from "solid-js";

export interface ${NAME}Props extends JSX.HTMLAttributes<${NAME}Instance> {

}

export interface ${NAME}Instance {

}
EOF

cat <<EOF >"$DIRNAME/index.ts"
export { default as ${NAME} } from './src/index';
export * from './src/props';

EOF

# cat > $DIRNAME/style/index.ts <<EOF
# import '@solid-ui/components/base/style'
# import '@solid-ui/theme-chalk/src/$INPUT_NAME.scss'
# EOF

# cat > $DIRNAME/style/css.ts <<EOF
# import '@solid-ui/components/base/style/css'
# import '@solid-ui/theme-chalk/$INPUT_NAME.css'
# EOF

# cat > $FILE_PATH/theme-chalk/src/$INPUT_NAME.scss <<EOF
# EOF

perl -0777 -pi -e "s/\n\n/\nexport * from '.\/$INPUT_NAME'\n\n/" $FILE_PATH/components/index.ts

