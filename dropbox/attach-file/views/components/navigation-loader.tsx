import { Component } from '@bearer/core'

@Component({ tag: 'navigation-loader', styleUrl: 'navigation-loader.css' })
export class NavigationLoader {
  randomWidthStyle() {
    const ammount = Math.random() * 30 + 50
    return { width: `${ammount}%` }
  }

  render() {
    return (
      <ul class='navigation-loader'>
        {Array(4)
          .fill(true)
          .map(() => (
            <li style={this.randomWidthStyle()} />
          ))}
      </ul>
    )
  }
}
