export interface Shell {
  go: (url: string) => void
  handOver: (url: string, fields: Readonly<Record<string, string>>) => void
}

export const backendShell: Shell = {
  go: url => { window.location.href = url },
  handOver: (url, fields) => {
    const form = document.createElement('form')
    form.method = 'post'
    form.action = url

    Object.entries(fields).forEach(([name, value]) => {
      const field = document.createElement('input')
      field.type = 'hidden'
      field.name = name
      field.value = value
      form.append(field)
    })

    document.body.append(form)
    form.submit()
  },
}
