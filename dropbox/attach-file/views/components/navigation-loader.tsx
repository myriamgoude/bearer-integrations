import { Component } from '@bearer/core'

@Component({ tag: 'navigation-loader', styleUrl: 'navigation-loader.css' })
export class NavigationLoader {
  randomWidthStyle() {
    const ammount = Math.random() * 30 + 50
    return { width: `${ammount}%` }
  }

  render() {
    return (
      <ul>
        {Array(4)
          .fill(true)
          .map(() => (
            <li class='loader' style={this.randomWidthStyle()} />
          ))}
      </ul>
    )
  }
}
