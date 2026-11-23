type WhatsAppIconProps = {
  size?: number
}

function WhatsAppIcon({ size = 18 }: WhatsAppIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.45L3 20.5l1.6-5.2A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M9.5 8.8c.2-.4.4-.4.6-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4 0 .6l-.4.5c-.1.2-.2.3-.1.5.4.8 1.1 1.5 1.9 1.9.2.1.3 0 .5-.1l.5-.4c.2-.1.4-.1.6 0l1.6.7c.3.1.4.3.4.5v.5c0 .2 0 .4-.4.6-.5.3-1.4.5-2.6.1-1.3-.4-2.8-1.4-4-2.6-1.2-1.2-2.2-2.7-2.6-4-.4-1.2-.2-2.1.1-2.6Z" />
    </svg>
  )
}

export default WhatsAppIcon
