import * as React from "react";
import { StringUtils } from "ts-commons";
import { Form, Input } from "antd";
import { FormComponentProps } from "antd/lib/form";

interface FileGeneratorProps extends FormComponentProps {}

interface FileGeneratorState {}

class FileGenerator extends React.Component<
  FileGeneratorProps,
  FileGeneratorState
> {
  public validateIPAddress = (rule: any, value: any, callback: any): void => {
    if (StringUtils.isBlank(value)) {
      callback();
    } else {
      const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (regex.test(value)) {
        callback();
      } else {
        callback(`"IP Address" is invalid`);
      }
    }
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
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Password">
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: `"Password" is required`
              }
            ]
          })(<Input type="password" />)}
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(FileGenerator);
