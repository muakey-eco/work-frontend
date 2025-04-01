import { SafetyOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Select } from "antd";
import clsx from "clsx";
import React, { useState } from "react";

type ProfileChangePasswordModalFormProps = {
    active?: boolean,
    label?: string,
    onChangeValue?: (text: string) => void
}

const ProfileIPRangeSecurityModalForm: React.FC<ProfileChangePasswordModalFormProps> = ({
    active,
    onChangeValue,
    label
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handelCancel = () => {
        setIsModalOpen(false);
        onChangeValue && onChangeValue("")
    }

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
                }}
            >
                <SafetyOutlined />
                {label}
            </div>
            <Modal
                okText="Lưu"
                cancelText="Hủy"
                title="Thiết lập dải IP"
                open={isModalOpen}
                onOk={handelCancel}
                onCancel={handelCancel}
                width={634}
            >
                <Form
                    layout="vertical"
                    className="flex flex-col gap-[8px]"
                >
                    <div>Thiết lập dải IP (tách biệt bằng dấu phẩy)</div>
                    <Form.Item className="mb-[0]!">
                        <Input placeholder="Để trống nếu cho phép truy cập từ mọi IP" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default ProfileIPRangeSecurityModalForm;