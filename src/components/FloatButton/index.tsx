import ViewNotificationFB from './ViewNotificationFB'
import ViewWorkFB from './ViewWorkFB'

type FloatButtonModalProps = {}

const FloatButtonModal: React.FC<FloatButtonModalProps> = (props) => {
  return (
    <div className="flex !gap-[10px]">
      <ViewWorkFB />
      <ViewNotificationFB />
    </div>
  )
}

export default FloatButtonModal
