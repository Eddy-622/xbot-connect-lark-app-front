import './App.css';
import { useState, useEffect } from 'react';
import { bitable } from '@lark-base-open/connector-api';
import { Button, Form, Select, Flex } from 'antd';

const { Option } = Select;

export default function App() {
    const [value, setValue] = useState('');
    const [userId, setUserId] = useState('');
    const [tenantKey, setTenantKey] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [form] = Form.useForm();
    
    console.log('test');
    useEffect(() => {
        bitable.getConfig().then(config => {
            console.log('pre sync config', config);
            setValue(config?.value || '');
        });
        bitable.getUserId().then(id => {
            console.log('userId', id);
            setUserId(id);
        });
        bitable.getTenantKey().then(key => {
            console.log('tenantKey', key);
            setTenantKey(key);
        })
    }, [])

    const handleSaveConfig = (config) => {
        console.log('config', config)
        bitable.saveConfigAndGoNext(config)
    }

    const handleOnChangePlatform = (platform: string) => {
        console.log("change", platform);
        
        // 当platform为空时，重置category字段
        if (!platform) {
            form.resetFields(['category']);
            setCategories([]);
            return;
        }

        const platformCategories = {
            jd: ["家用电器", "手机", "数码", "电脑", "办公", "家居", "食品", "家具", "男装", "女装"],
            tian_mao: ["天猫"],
            pdd: ["拼多多"],
            wph: ["唯品会"],
            dy: ["抖音"]
        }

        const categories = platformCategories[platform as keyof typeof platformCategories] || [];
        setCategories(categories);
        
    }

    return (
        <div>
            <Flex justify="center" align="center">
                <h5>影刀DC同步电商数据到多维表格</h5>
            </Flex>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
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
                        <Option value="jd">京东</Option>
                        <Option value="tian_mao">淘宝天猫</Option>
                        <Option value="pdd">拼多多</Option>
                        <Option value="dy">抖音电商</Option>
                        <Option value="wph">唯品会</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="category" label="品类" rules={[{ required: true }]} >
                    <Select
                        placeholder="选择一个获取数据的平台"
                        allowClear
                        disabled={categories.length === 0}
                    >
                        {
                            categories.map(item => {
                                return <Option value={item}>{item}</Option>
                            })
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    label=""
                >
                    <Button type="primary" htmlType="submit">下一步</Button>
                </Form.Item>
            </Form>
        </div>
    )
}