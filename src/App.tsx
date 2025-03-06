import "./App.css";
import { useState, useEffect } from "react";
import { bitable } from "@lark-base-open/connector-api";
import { Button, Form, Select, Flex, Space, Input, Card, Typography, Divider } from "antd";
import { UserOutlined, QuestionCircleOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

export default function App() {
  const [value, setValue] = useState("");
  const [userId, setUserId] = useState("");
  const [tenantKey, setTenantKey] = useState("");

  const [selectSource, setSelectSource] = useState<string>("");
  const [secUserIdCheckStatus, setsecUserIdCheckStatus] = useState<
    "" | "success" | "warning" | "error" | "validating"
  >("");

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

  // 根据设计规范定义的颜色变量
  const colors = {
    primary: "#1677ff",
    background: "#f5f5f5",
    cardBg: "#ffffff",
    textPrimary: "#1f2329", // N900
    textSecondary: "#646a73", // N600
    textTertiary: "#8f959e", // N500
    borderColor: "#e5e6eb", // N300
    dividerColor: "rgba(31, 35, 41, 0.15)" // N900 15%透明度
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "90vh",
      padding: "16px",
      // background: colors.background,
      fontFamily: "-apple-system,BlinkMacSystemFont,Helvetica Neue,Tahoma,PingFang SC,Microsoft Yahei,Arial,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji"
    }}>
      <Card 
        style={{ 
          width: "100%", 
          maxWidth: "600px", 
          margin: "0 auto",
          borderRadius: "4px", // 按钮圆角规范
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: `1px solid ${colors.borderColor}`
        }}
      >
        <Flex justify="center" align="center" style={{ marginBottom: "16px" }}>
          <Title level={4} style={{ 
            margin: 0, 
            color: colors.textPrimary,
            fontSize: "16px",
            fontWeight: 500,
            lineHeight: "24px"
          }}>
            影刀DC同步抖音数据到多维表格
          </Title>
        </Flex>
        
        <Divider style={{ 
          margin: "0 0 16px 0",
          backgroundColor: colors.dividerColor
        }} />

        <Form
          form={form}
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={handleSaveConfig}
          autoComplete="off"
          style={{ width: "100%" }}
        >
          <Form.Item
            name="data_category"
            label={<span style={{ color: colors.textPrimary, fontSize: "14px" }}>数据来源</span>}
            rules={[{ required: true, message: "请选择数据来源" }]}
          >
            <Select
              placeholder="选择一个数据来源"
              allowClear
              onChange={(value) => setSelectSource(value)}
              size="middle" // 中等尺寸按规范
              style={{ width: "100%" }}
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
              label={<span style={{ color: colors.textPrimary, fontSize: "14px" }}>视频ID/modal_id</span>}
              rules={[{ required: true, len: 19, message: "请输入19位视频ID" }]}
              help={<span style={{ color: colors.textTertiary, fontSize: "12px" }}>视频ID长度为19位</span>}
            >
              <Input 
                placeholder="抖音视频链接中的ID" 
                size="middle"
                style={{ width: "100%" }}
              />
            </Form.Item>
          ) : (
            <Form.Item
              name="user_sec_id"
              label={<span style={{ color: colors.textPrimary, fontSize: "14px" }}>sec_user_id</span>}
              validateStatus={secUserIdCheckStatus}
              help={<span style={{ color: colors.textTertiary, fontSize: "12px" }}>ID长度为 55位 或 76位</span>}
              rules={[{ required: true, message: "请输入sec_user_id" }]}
            >
              <Input
                placeholder="抖音主页链接中的ID"
                size="middle"
                style={{ width: "100%" }}
                onChange={(e) => {
                  const len = e.target.value.length;
                  if (len === 55 || len === 76) {
                    setsecUserIdCheckStatus("success");
                  } else if (len > 0) {
                    setsecUserIdCheckStatus("error");
                  } else {
                    setsecUserIdCheckStatus("");
                  }
                }}
              />
            </Form.Item>
          )}

          <Form.Item style={{ marginTop: "24px" }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="middle"
              style={{ 
                width: "100%", 
                height: "32px", // 中等尺寸按钮规范
                borderRadius: "4px", // 按钮圆角规范
                fontWeight: "normal",
                fontSize: "14px"
              }}
            >
              下一步
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Flex className="footer" justify="center" align="center" style={{ marginTop: "16px" }}>
        <Space size="middle">
          <Text style={{ 
            color: colors.textTertiary, 
            fontSize: "12px",
            lineHeight: "20px"
          }}>
            由影刀数据连接器提供技术服务
          </Text>
          <Divider type="vertical" style={{ backgroundColor: colors.dividerColor }} />
          <a 
            href={helpDeskLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: colors.primary,
              fontSize: "12px",
              lineHeight: "20px"
            }}
          >
            <UserOutlined style={{ marginRight: "4px" }} />
            <span>付费定制</span>
          </a>
          <a 
            href={useDocLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: colors.primary,
              fontSize: "12px",
              lineHeight: "20px"
            }}
          >
            <QuestionCircleOutlined style={{ marginRight: "4px" }} />
            <span>使用说明</span>
          </a>
        </Space>
      </Flex>
    </div>
  );
}
