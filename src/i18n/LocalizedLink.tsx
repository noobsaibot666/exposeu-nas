import { Link, type LinkProps } from 'react-router-dom'
import { useLocalePath } from './LocaleProvider'

type LocalizedLinkProps = Omit<LinkProps, 'to'> & {
  to: string
}

function LocalizedLink({ to, ...props }: LocalizedLinkProps) {
  const localize = useLocalePath()
  const nextTo = typeof to === 'string' && to.startsWith('/') ? localize(to) : to

  return <Link {...props} to={nextTo} />
}

export default LocalizedLink
