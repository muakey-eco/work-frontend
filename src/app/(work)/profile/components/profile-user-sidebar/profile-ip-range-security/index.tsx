import { Form, Input, Modal, Select } from "antd";
import { useState } from "react";

const ProfileIPRangeSecurity = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div
                className="cursor-pointer hover:text-[#1890FF]"
                onClick={() => setIsModalOpen(true)}>
                Bảo mật theo dải IP
            </div>
            <Modal
                okText="Lưu"
                cancelText="Hủy"
                title="Thiết lập dải IP"
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
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

export default ProfileIPRangeSecurity;