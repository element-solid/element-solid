import { Component, onMount } from 'solid-js';
import { createStore } from "solid-js/store";
import { InputInstance, FormInstance, Form, RadioGroup, Radio, Input, InputNumber, FormItem, ConfigProvider, Button } from 'element-solid';


const App: Component = () => {

  let input: InputInstance | undefined;
  let formRef!: FormInstance;
  onMount(() => {
    console.log(input);
    input?.select()
  })
  const [state, setState] = createStore({
    name: undefined,
    age: 18,
    sex: 'man',
    hobby: undefined
  });
  async function submit() {
    const result = await formRef.validate();
    console.log('result', result)
  }
  const items = [
    { type: '', label: 'Tag 1' },
    { type: 'success', label: 'Tag 2' },
    { type: 'info', label: 'Tag 3' },
    { type: 'danger', label: 'Tag 4' },
    { type: 'warning', label: 'Tag 5' },
  ]
  return (
    <div>
      <ConfigProvider >
        <Form model={state}>
          <FormItem label='姓名' prop="name"><Input value={state.name} onChange={name => setState({ name })} /></FormItem>
          <FormItem label='年龄' prop="age"><InputNumber value={state.age} onChange={age => setState({ age })} /></FormItem>
          <FormItem label='性别' prop="sex">
            <RadioGroup value={state.sex} onChange={(sex) => setState({ sex })}>
              <Radio label="man">男</Radio>
              <Radio label="women">女</Radio>
            </RadioGroup>
          </FormItem>
          <Button onClick={submit} type="primary">submit</Button>
        </Form>

      </ConfigProvider >
    </div >
  );
};

export default App;
