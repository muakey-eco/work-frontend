'use client'

import { StageContext } from '@/app/(work)/workflows/[id]/components/WorkflowPageLayout'
import { useAsyncEffect } from '@/libs/hook'
import { PlusOutlined } from '@ant-design/icons'
import {
  App,
  Button,
  ColorPicker,
  Divider,
  Empty,
  Input,
  InputRef,
  Select,
  SelectProps,
  Tag,
  Tooltip,
} from 'antd'
import { AggregationColor } from 'antd/es/color-picker/color'
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { addTagAction, getTagsAction, updateTagAction } from '../action'
import TagOption from './TaskOption'

type TagSelectProps = Omit<SelectProps, 'open' | 'onClick'> & {
  params?: any
  tags?: any
  onTagsChange?: (tags: any) => void
  open?: boolean
  onClick?: () => void
}

const TagSelect: React.FC<TagSelectProps> = ({
  params,
  tags: initTags,
  onTagsChange,
  onClick,
  ...rest
}) => {
  const [tags, setTags] = useState<any[]>(initTags || [])
  const [tagAddLoading, setTagAddLoading] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const [tagName, setTagName] = useState('')
  const [tagColor, setTagColor] = useState('')

  const { setStages } = useContext(StageContext)
  const { message } = App.useApp()

  const onNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTagName(event.target.value)
    },
    [],
  )

  const onColorChange = useCallback((event: AggregationColor) => {
    setTagColor(event.toHexString())
  }, [])

  const handleAdd = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    setTagAddLoading(true)

    e.preventDefault()

    if (!tagName) {
      setTagAddLoading(false)
      return
    }

    try {
      const {
        id,
        message: msg,
        errors,
      } = await addTagAction({
        title: tagName,
        code_color: tagColor,
        workflow_id: params?.id,
      })

      if (errors) {
        setTagAddLoading(false)
        message.error(msg)
        return
      }

      setTags([
        ...tags,
        {
          title: tagName,
          code_color: tagColor,
          id,
        },
      ])
      setTagName('')
      setTagColor('')

      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
      setTagAddLoading(false)
    } catch (error) {
      setTagAddLoading(false)
      throw new Error(String(error))
    }
  }

  const handleEdit = async (values: any) => {
    const { id, ...restValues } = values

    if (!restValues?.title && !restValues?.color) return

    try {
      const { message: msg, errors } = await updateTagAction(id, {
        title: restValues.title,
        code_color: restValues.color,
        workflow_id: params?.id,
      })

      if (errors) {
        message.error(msg)
        return
      }

      setTags((prevTags: any[]) => {
        const newTags = [...prevTags]

        return newTags.map((tag: any) => {
          if (tag.id === id) {
            return {
              ...tag,
              title: restValues.title,
              code_color: restValues.color,
            }
          }

          return tag
        })
      })

      setStages((prevStages: any) => {
        const newStages = [...prevStages]

        return newStages.map((stage: any) => {
          return {
            ...stage,
            tasks: stage?.tasks?.map((task: any) => ({
              ...task,
              tags: task?.tags?.map((tag: any) => {
                if (tag?.id === id) {
                  return {
                    ...tag,
                    title: restValues.title,
                    code_color: restValues.color,
                    workflow_id: params?.id,
                  }
                }

                return tag
              }),
            })),
          }
        })
      })
    } catch (error) {
      throw new Error(String(error))
    }
  }

  const optionRender: SelectProps['optionRender'] = (option: any) => {
    return (
      <TagOption
        option={option}
        onDelete={() => {
          setTags((prevTags: any[]) =>
            prevTags.filter((tag: any) => tag?.id !== Number(option?.value)),
          )
        }}
        onEdit={handleEdit}
      />
    )
  }

  const dropdownRender: SelectProps['dropdownRender'] = (menu) => (
    <div onClick={(e) => e.stopPropagation()}>
      {menu}
      <Divider style={{ margin: '8px 0' }} />
      <div
        className="flex w-full items-center gap-[8px]"
        style={{ padding: '0 8px 4px' }}
      >
        <div className="flex flex-1 items-center gap-[12px]">
          <Input
            className="flex-1"
            placeholder="Tên nhãn"
            ref={inputRef}
            value={tagName}
            onChange={onNameChange}
            onKeyDown={(e) => e.stopPropagation()}
          />
          <ColorPicker defaultValue="#888" onChange={onColorChange} showText />
        </div>
        <Button
          className="w-[130px]!"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          loading={tagAddLoading}
          type="primary"
        >
          Thêm nhãn
        </Button>
      </div>
    </div>
  )

  const tagRender: SelectProps['tagRender'] = (props) => {
    const { label, closable, onClose } = props
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault()
      event.stopPropagation()
    }
    return (
      <Tooltip title={String(label).split('-')[0]}>
        <Tag
          className="flex items-center"
          color={
            String(label).split('-')[1] !== 'null'
              ? String(label).split('-')[1]
              : '#888'
          }
          onMouseDown={onPreventMouseDown}
          closable={closable}
          onClose={onClose}
          style={{ marginInlineEnd: 4, maxWidth: 150 }}
        >
          <span className="line-clamp-1">{String(label).split('-')[0]}</span>
        </Tag>
      </Tooltip>
    )
  }

  useAsyncEffect(async () => {
    const res = await getTagsAction({
      workflow_id: params?.id,
    })

    setTags(res)
  }, [])

  useEffect(() => {
    onTagsChange?.(tags)
  }, [tags, onTagsChange])

  return (
    <Select
      placeholder="Chọn nhãn"
      mode="multiple"
      options={tags.map((item: any) => ({
        label: `${item?.title}-${item?.code_color}`,
        value: item?.id,
        code_color: item?.code_color,
      }))}
      optionRender={optionRender}
      dropdownRender={dropdownRender}
      tagRender={tagRender}
      notFoundContent={<Empty description="Chưa có nhãn" />}
      allowClear
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      {...rest}
    />
  )
}

export default memo(TagSelect)
