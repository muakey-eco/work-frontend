import ViewNotificationFB from './ViewNotificationFB'
import ViewWorkFB from './ViewWorkFB'

type FloatButtonModalProps = {}

const FloatButtonModal: React.FC<FloatButtonModalProps> = (props) => {
  return (
    <>
      <ViewWorkFB />
      <ViewNotificationFB />
    </>
  )
}

export default FloatButtonModal
