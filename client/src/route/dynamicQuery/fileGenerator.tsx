import * as React from "react";
import { Form, Input } from "antd";
import { FormComponentProps } from "antd/lib/form";

interface FileGeneratorProps extends FormComponentProps {}

interface FileGeneratorState {}

class FileGenerator extends React.Component<
  FileGeneratorProps,
  FileGeneratorState
> {
  private validateIPAddress = (rule: any, value: any, callback: any): void => {
    console.log(`value: ${value}`);
    callback();
  };

  public render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    return (
      <Form {...formItemLayout}>
        <Form.Item label="IP Address">
          {getFieldDecorator("ipAddress", {
            rules: [
              {
                required: true,
                message: `"IP Address" is required`
              },
              {
                validator: this.validateIPAddress
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Port">
          {getFieldDecorator("port", {
            rules: [
              {
                required: true,
                message: `"Port" is required!`
              },
              {
                validator: this.validateIPAddress
              }
            ]
          })(<Input type="number" />)}
        </Form.Item>
        <Form.Item label="User">
          {getFieldDecorator("user", {
            rules: [
              {
                required: true,
                message: `"User" is required!`
              },
              {
                validator: this.validateIPAddress
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Password">
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "Please input your password!"
              },
              {
                validator: this.validateIPAddress
              }
            ]
          })(<Input type="password" />)}
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(FileGenerator);
