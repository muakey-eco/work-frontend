import { Button, Form, Modal } from "antd";
import { useState } from "react";
import IconSuccess from '@/assets/images/icon-success-second-level-password.png';
import { LockOutlined } from "@ant-design/icons";

const ProfileSecondLevelPassword = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div
                className="flex cursor-pointer hover:text-[#1890FF] gap-[10px]"
                onClick={() => setIsModalOpen(true)}>
                <LockOutlined />
                <p>Mật khẩu cấp hai</p>
            </div>
            <Modal
                okText="Lưu"
                cancelText="Hủy"
                title="Mật khẩu cấp hai"
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                width={433}
                footer={null}
            >
                <Form
                    layout="vertical"
                    className="flex flex-col items-center gap-[16px]"
                >
                    <img
                        src={IconSuccess.src}
                        alt=""
                        className="w-[168px] h-[112px]"
                    />
                    <p>Đã cấp mật khẩu cấp hai</p>
                    <Button
                        type="primary"
                        onClick={() => setIsModalOpen(false)}
                    >Yêu cầu cấp lại</Button>
                </Form >
            </Modal >
        </>
    )
}

export default ProfileSecondLevelPassword;