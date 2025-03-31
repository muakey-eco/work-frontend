import { Pagination } from "antd";

type LoginHistoryFooterTableProps = {
    current: number,
    pageSize: number,
    total: number,
    onChange: (page: number, pageSize: number) => void,
}

const LoginHistoryFooterTable: React.FC<LoginHistoryFooterTableProps> = ({
    current,
    pageSize,
    total,
    onChange
}) => {
    return (
        <div className='flex items-center m-[16px]'>
            <Pagination
                current={current}
                pageSize={pageSize}
                total={total}
                showSizeChanger
                showQuickJumper
                onChange={onChange}
                showTotal={() => <p className='text-[#000000E0]'>Total {total} items</p>}
            />
        </div>
    );
};

export default LoginHistoryFooterTable;