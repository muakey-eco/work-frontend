'use client'
import { LockOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Switch } from "antd";
import clsx from "clsx";
import React, { useState } from "react";

type ProfileChangePasswordModalFormProps = {
    active?: boolean,
    label?: string,
    onChangeValue?: (text: string) => void
}

const ProfileChangePasswordModalForm: React.FC<ProfileChangePasswordModalFormProps> = ({
    active,
    onChangeValue,
    label
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handelCancel = () => {
        setIsModalOpen(false);
        onChangeValue && onChangeValue("")
    }

    const [password, setPassword] = useState('');

    const checkLength = password.length >= 8;
    const checkUppercase = /[A-Z]/.test(password);
    const checkNumber = /\d/.test(password);
    const checkSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return (
        <>
            <div
                className={clsx(
                    'flex cursor-pointer hover:text-[#1890FF] gap-[10px]',
                    { 'text-[#1890FF]': active }
                )}
                onClick={() => {
                    setIsModalOpen(true);
                    onChangeValue && onChangeValue(label || "")
                }}>
                <LockOutlined />
                {label}
            </div>
            <Modal
                okText="Đổi mật khẩu"
                cancelText="Hủy"
                title="Đổi mật khẩu"
                open={isModalOpen}
                onOk={handelCancel}
                onCancel={handelCancel}
                width={634}
            >
                <Form
                    layout="vertical"
                    className="flex flex-col gap-[16px] w-full"
                >
                    <Form.Item
                        label="Mật khẩu hiện tại"
                        className="mb-0!"
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Mật khẩu mới"
                        className="mb-0!"
                    >
                        <Input.Password
                            value={password}
                            onChange={(text) => setPassword(text.target.value)}
                        />
                        <ul className="text-[12px] mt-[8px]">
                            <li className={`${checkLength ? 'text-[#1890FF]' : 'text-[#000000D9]'}`}>- Ít nhất 8 ký tự</li>
                            <li className={`${checkUppercase ? 'text-[#1890FF]' : 'text-[#000000D9]'}`}>- Ít nhất 1 chữ cái viết hoa</li>
                            <li className={`${checkNumber ? 'text-[#1890FF]' : 'text-[#000000D9]'}`}>- Ít nhất 1 ký tự số</li>
                            <li className={`${checkSpecial ? 'text-[#1890FF]' : 'text-[#000000D9]'} `}>- Ít nhất 1 ký tự đặc biệt</li>
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
                        <Switch
                            defaultChecked
                            size="default"
                        />
                    </div>
                </Form>
            </Modal>
        </>
    )
}

export default ProfileChangePasswordModalForm;