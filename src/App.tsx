import './App.css';
import { useState, useEffect } from 'react';
import { bitable } from '@lark-base-open/connector-api';
import { Button, Form, Select, Flex, Space } from 'antd';

import { UserOutlined } from '@ant-design/icons';

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

        const platformCategories = {
            jd: ["家用电器", "手机", "数码", "电脑", "办公", "家居", "食品", "家具", "男装", "女装"],
            tian_mao: ["美妆", "电脑", "工业品", "家电", "手机", "数码", "家具", "女装", "男装", "内衣", "配饰", "女鞋", "男鞋", "运动", "户外", "汽车", "珠宝", "文玩", "食品", "生鲜", "酒类", "健康", "母婴", "童装", "玩具", "宠物", "个护", "娱乐", "图书"],
            pdd: ["当季女装", "品牌男装", "医药健康", "环球美食", "鞋包配饰", "家居百货", "美妆护肤", "家电数码", "母婴呵护", "家纺家具", "运动户外", "海淘精选"],
            wph: ["连衣裙", "半截裙", "女士套装", "女士T恤", "女士羊毛衫", "女士背心", "女士棉衣", "卫衣", "女士西裤", "牛仔裤", "女士打底裤", "女士休闲裤", "女士皮裤", "女士西服", "女士大衣", "女士外套", "女士风衣", "女士夹克"],
            // dy: ["抖音"]
        }

        const categories = platformCategories[platform as keyof typeof platformCategories] || [];

        if (categories.length !== 0) {
            form.setFieldValue("category", categories[0]);
        }
        setCategories(categories);
    }

    const useDocLink = "";
    const helpDeskLink = "";


    return (
        <>
            <Flex justify="center" align="center">
                <h5>影刀DC同步电商数据到多维表格</h5>
            </Flex>

            <Flex justify="center">

                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 30 }}
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
                            <Option value="tian_mao">淘宝天猫</Option>
                            <Option value="jd">京东</Option>
                            <Option value="pdd">拼多多</Option>
                            <Option value="wph">唯品会</Option>

                            {/* <Option value="dy">抖音电商</Option> */}
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

                    <Flex justify="right">
                        <Space size="small">
                            <Button onClick={() => bitable.ui.closeHostContainer()}>取消</Button>
                            <Button type="primary" htmlType="submit">下一步</Button>
                        </Space>
                    </Flex>

                </Form>

            </Flex>

            <Flex className="footer" justify="center" align="flex-end">
                <div style={{ color: 'grey' }}>
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
        </>
    )
}