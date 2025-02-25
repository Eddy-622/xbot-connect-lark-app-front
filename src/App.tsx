import "./App.css";
import { useState, useEffect } from "react";
import { bitable } from "@lark-base-open/connector-api";
import { Button, Form, Select, Flex, Space } from "antd";

import { UserOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function App() {
  const [value, setValue] = useState("");
  const [userId, setUserId] = useState("");
  const [tenantKey, setTenantKey] = useState("");

  const [categories, setCategories] = useState<string[]>([]);
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

  const handleOnChangePlatform = (platform: string) => {
    console.log("change", platform);

    const platformCategories = {
      wei_bo: [
        "热搜",
        "文娱",
        "要闻",
        "校园热搜",
        "体育热搜",
        "游戏热搜",
        "时尚热搜",
        "美妆热搜",
        "汽车热搜",
        "旅游热搜",
        "科技数码热搜",
        "母婴热搜",
        "健康热搜",
      ],
      bai_du: ["全部热搜", "小说", "电影", "电视剧", "汽车", "游戏"],
    };

    const categories =
      platformCategories[platform as keyof typeof platformCategories] || [];

    if (categories.length !== 0) {
      form.setFieldValue("category", categories[0]);
    }
    setCategories(categories);
  };

  const useDocLink = "#";
  const helpDeskLink = "#";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "95vh" }}>
      <Flex justify="center" align="center">
        <h4>影刀DC同步热搜榜单到多维表格</h4>
      </Flex>

      <Flex justify="center">
        <Form
          form={form}
          name="basic"
          //   labelCol={{ span: 2 }}
          //   wrapperCol={{ span: 29 }}
          style={{ width: "100vw" }}
          initialValues={{ remember: true }}
          onFinish={handleSaveConfig}
          autoComplete="off"
        >
          <Form.Item name="platform" label="平台" rules={[{ required: true }]}>
            <Select
              placeholder="选择一个获取数据的平台"
              allowClear
              onChange={handleOnChangePlatform}
            >
              <Option value="wei_bo">微博</Option>
              <Option value="bai_du">百度</Option>
            </Select>
          </Form.Item>

          <Form.Item name="category" label="类型" rules={[{ required: true }]}>
            <Select
              placeholder="选择热搜类型"
              allowClear
              disabled={categories.length === 0}
            >
              {categories.map((item) => {
                return <Option value={item}>{item}</Option>;
              })}
            </Select>
          </Form.Item>

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
          <a href={helpDeskLink}>
            <UserOutlined />
            <span>付费定制</span>
          </a>
          <a href={useDocLink}>
            <span>&nbsp;使用说明</span>
          </a>
        </div>
      </Flex>
    </div>
  );
}
