import "./App.css";
import { useState, useEffect } from "react";
import { bitable } from "@lark-base-open/connector-api";
import { Button, Form, Select, Flex, Space, Input } from "antd";

import { UserOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function App() {
  const [value, setValue] = useState("");
  const [userId, setUserId] = useState("");
  const [tenantKey, setTenantKey] = useState("");

  const [selectSource, setSelectSource] = useState<string>("");
  const [form] = Form.useForm();

  useEffect(() => {
    bitable.getConfig().then((config) => {
      console.log("pre sync config", config);
      setValue(config?.value || "");
    });
    bitable.getUserId().then((id) => {
      console.log("userId", id);
      setUserId(id);
    });
    bitable.getTenantKey().then((key) => {
      console.log("tenantKey", key);
      setTenantKey(key);
    });
  }, []);

  const handleSaveConfig = (config: object) => {
    console.log("config", config);
    bitable.saveConfigAndGoNext(config);
  };

  const useDocLink =
    "https://ying-dao.feishu.cn/docx/LIFada2LWo657WxurYGcHV4GnYe";
  const helpDeskLink =
    "https://ying-dao.feishu.cn/wiki/R6uswOyV3iy9vLkfNzlckuJBnuc?fromScene=bitTable";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "95vh" }}>
      <Flex justify="center" align="center">
        <h4>影刀DC同步抖音数据到多维表格</h4>
      </Flex>

      <Flex justify="center">
        <Form
          form={form}
          name="basic"
          style={{ width: "100vw" }}
          initialValues={{ remember: true }}
          onFinish={handleSaveConfig}
          autoComplete="off"
        >
          <Form.Item
            name="data_category"
            label="数据来源"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="选择一个数据来源"
              allowClear
              onChange={(value) => setSelectSource(value)}
              defaultValue="user_profile"
            >
              <Option value="user_profile">用户主页数据</Option>
              <Option value="user_video_works">用户视频作品</Option>
              <Option value="video_comments">抖音视频评论</Option>
            </Select>
          </Form.Item>

          {/* 根据不同的selectSource弹出不同的选项 */}

          {selectSource === "video_comments" ? (
            <Form.Item
              name="aweme_id"
              label="视频ID/modal_id"
              rules={[{ required: true, len: 19 }]}
            >
              <Input placeholder="抖音视频链接中的ID" />
            </Form.Item>
          ) : (
            <Form.Item
              name="user_sec_id"
              label="sec_user_id"
              rules={[{ required: true, len: 76 }]}
            >
              <Input placeholder="抖音主页链接中的ID" />
            </Form.Item>
          )}

          <Flex justify="right">
            <Space size="small">
              <Button onClick={() => bitable.ui.closeHostContainer()}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                下一步
              </Button>
            </Space>
          </Flex>
        </Form>
      </Flex>

      <Flex className="footer" justify="center" align="flex-end">
        <div style={{ color: "grey" }}>
          由影刀数据连接器提供技术服务
          <a href={helpDeskLink} target="_blank">
            <UserOutlined />
            <span>付费定制</span>
          </a>
          <a href={useDocLink} target="_blank">
            <span>&nbsp;使用说明</span>
          </a>
        </div>
      </Flex>
    </div>
  );
}
