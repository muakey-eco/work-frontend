'use client'

import { EyeOutlined } from "@ant-design/icons";
import { Checkbox, Form, Modal, Select, SelectProps } from "antd"
import { useState } from "react";

const rightToViewInformationOptions: SelectProps['options'] = [
    {
        label: 'Công khai (Công khai thông tin liên hệ của tất cả nhân viên)',
        value: 'Công khai (Công khai thông tin liên hệ của tất cả nhân viên)'
    },
    {
        label: 'Riêng tư (Chỉ hiển thị thông tin cho người quản lý, quản trị cấp cao và cấp cao hơn)',
        value: 'Riêng tư (Chỉ hiển thị thông tin cho người quản lý, quản trị cấp cao và cấp cao hơn)'
    },
];

const ProfileRightToViewInformation = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div
                className="flex cursor-pointer hover:text-[#1890FF] gap-[10px]"
                onClick={() => setIsModalOpen(true)}>
                <EyeOutlined />
                <p>Quyền xem thông tin</p>
            </div>
            <Modal
                okText="Lưu"
                cancelText="Hủy"
                title="Quyền xem thông tin"
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                width={634}
            >
                <Form
                    layout="vertical"
                    className="flex flex-col gap-[16px] w-full"
                >
                    <div>
                        <Form.Item
                            className="mb-0!"
                            label="Quyền xem thông tin"
                        >
                            <Select
                                defaultValue="Công khai (Công khai thông tin liên hệ của tất cả nhân viên)"
                                options={rightToViewInformationOptions}
                            />
                        </Form.Item>
                    </div>

                    <div>Thông tin cần ẩn (Chỉ có tác dụng khi lựa chọn chế độ Riêng tư)</div>

                    <div className="grid grid-cols-2">
                        <Form.Item
                            className="mb-0! flex-1"
                        >
                            <Checkbox>Thông tin cá nhân</Checkbox>
                        </Form.Item>
                        <Form.Item
                            className="mb-0! flex-1"
                        >
                            <Checkbox>Thông tin nhân viên</Checkbox>
                        </Form.Item>
                        <Form.Item
                            className="mb-0! flex-1"
                        >
                            <Checkbox>Trình độ học vấn</Checkbox>
                        </Form.Item>
                        <Form.Item
                            className="mb-0! flex-1"
                        >
                            <Checkbox>Kinh nghiệm làm việc</Checkbox>
                        </Form.Item>
                        <Form.Item
                            className="mb-0! flex-1"
                        >
                            <Checkbox>Giải thưởng & Thành tích</Checkbox>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default ProfileRightToViewInformation;