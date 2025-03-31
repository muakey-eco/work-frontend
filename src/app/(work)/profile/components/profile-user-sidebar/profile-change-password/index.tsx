'use client'
import { LockOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Switch } from "antd";
import React, { useState } from "react";

const ProfileChangePassword = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div
                className="flex cursor-pointer hover:text-[#1890FF] gap-[10px]"
                onClick={() => setIsModalOpen(true)}>
                <LockOutlined />
                <p>Đổi mật khẩu</p>
            </div>
            <Modal
                okText="Đổi mật khẩu"
                cancelText="Hủy"
                title="Đổi mật khẩu"
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                width={634}
            >
                <Form
                    layout="vertical"
                    className="flex flex-col gap-[16px] w-full"
                >
                    <Form.Item
                        label="Mật khẩu mới"
                        className="mb-0!"
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Mật khẩu mới"
                        className="mb-0!"
                    >
                        <Input.Password />
                        <ul className="text-[12px] mt-[8px]">
                            <li>- Ít nhất 8 ký tự</li>
                            <li>- Ít nhất 1 chữ cái viết hoa</li>
                            <li>- Ít nhất 1 ký tự số</li>
                            <li>- Ít nhất 1 ký tự đặc biệt</li>
                        </ul>
                    </Form.Item>
                    <Form.Item
                        className="mb-0!"
                        label="Nhập lại mật khẩu mới"
                    >
                        <Input.Password />
                    </Form.Item>
                    <div className="flex items-center gap-[24px]">
                        <p>Đăng xuất khỏi tất cả thiết bị</p>
                        <Switch defaultChecked size="default" />
                    </div>
                </Form>
            </Modal>
        </>
    )
}

export default ProfileChangePassword;