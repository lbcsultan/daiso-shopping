import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div>
      <Button variant="default" size="lg">
        Button: click me
      </Button>

      <Button variant="destructive" size="sm">
        Button: click me
      </Button>

      <Button variant="outline" size="default">
        Button: click me
      </Button>
    </div>
  )
}
