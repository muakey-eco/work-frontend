import { SafetyOutlined } from "@ant-design/icons";
import clsx from "clsx";
import React from "react";

type TwoFactorAuthencationProps = {
    active?: boolean,
    label?: string,
    onChangeValue?: (text: string) => void
}

const TwoFactorAuthencation: React.FC<TwoFactorAuthencationProps> = ({
    active,
    onChangeValue,
    label
}) => {
    return (
        <>
            <div
                className={clsx(
                    'flex cursor-pointer gap-[10px]',
                    // { 'text-[#1890FF]': active }
                )}
            >
                <SafetyOutlined />
                {label}
            </div>
        </>
    )
}

export default TwoFactorAuthencation;