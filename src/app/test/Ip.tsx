'use client'

import React, { useEffect, useState } from 'react'

const Ip: React.FC = (props) => {
  const [ip, setIp] = useState('')

  useEffect(() => {
    fetch('https://api64.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch((err) => console.error('Error fetching IP:', err))
  }, [])

  return <div>Your IP: {ip}</div>
}

export default Ip
