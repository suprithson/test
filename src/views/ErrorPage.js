import {useRouteError} from 'react-router-dom'

export default function ErrorView() {
  const error = useRouteError()
  return (
    <div className="width-100 height-100 flex-column justify-content-center align-items-center off-white-bg">
      <div className="center-text font-helvetica">
        <h1 className="bold-text font-25">Oops!</h1>
        <br />
        <p>Sorry, an unexpected error has occurred.</p>
        <p><i>{error.statusText || error.message}</i></p>
      </div>
    </div>
  )
}