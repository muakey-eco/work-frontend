import { createStyles } from 'antd-style'

const useStyle = createStyles(({ css }) => {
  return {
    customTable: css`
      .ant-table {
        .ant-table-container {
          .ant-table-body,
          .ant-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
    customCalendar: css`
      .ant-picker-panel {
        border: 0 !important;
      }
      .ant-picker-body {
        padding: 0 !important;
        .ant-picker-content {
          tbody {
            tr {
              td {
                padding: 0 !important;
              }
            }
          }
          thead {
            tr {
              th {
                padding: 12px 0;
                font-weight: 600;
              }
              & > :not(:last-child) {
                border-right: solid 1px #0505050f;
              }
            }
          }
        }
      }
    `,
  }
})

export default useStyle
