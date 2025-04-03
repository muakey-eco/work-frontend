'use client'

import { Button, Form, FormInstance, Input } from 'antd'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { loginWidthCredentialsAction } from './action'

const LoginForm: React.FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const formRef = useRef<FormInstance>(null)

  const login = async (formData: any) => {
    setLoading(true)

    try {
      const { errors } = await loginWidthCredentialsAction(formData)

      if (errors) {
        if (typeof errors === 'string') {
          toast.error(errors)
        } else {
          formRef.current?.setFields(
            Object.keys(errors).map((k: string) => ({
              name: k,
              errors: [errors[k]],
            })),
          )
        }

        setLoading(false)
        return
      }

      router.push('/workflows')

      setLoading(false)
    } catch (error: any) {
      setLoading(false)
      throw new Error(error)
    }
  }

  return (
    <Form
      className="w-[400px]"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={login}
      autoComplete="off"
      layout="vertical"
      ref={formRef}
    >
      <Form.Item
        label="Email/Tên đăng nhập"
        name="email"
        rules={[
          {
            required: true,
            message: 'Email/Tên đăng nhập không được bỏ trống.',
          },
        ]}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Mật khẩu không được bỏ trống.' }]}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  )
}

export default LoginForm
