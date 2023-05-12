const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }

  if (isError) {
    return (
      <div className="notification error">
        {message}
      </div>
    )
  } else {
    return (
      <div className="notification success">
        {message}
      </div>
    )
  }
}

export default Notification
