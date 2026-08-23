Info
====

Based on the classic space invaders, with some changes.

The goal is to defeat the invading alien ships and save earth!

When you finish a level, the score/lives you had is carried on to the next level, allowing you to improve your score.

Firing bullets reduces your overall score (also is reduced as time passes), so its important to use as less bullets as possible, and finish the level fast, to get a higher score.

[Try it out here](http://nbpt.eu/games/space_invaders/)

Gameplay
========

- you control a laser cannon on the bottom of the screen
- can be moved horizontally
- can fire any number of bullets
- the goal is to defeat 5 rows of 11 aliens
- the alien ships move horizontally as a group back and forth, and move down as it reaches an extreme of the canvas (changing the direction after)
- as more alien ships are destroyed, the movement speed of the remaining ships (as well as the music's tempo) is increased
- the alien ships occasionally fire a bullet as well
- you loose a life for every hit you take
- if the enemy ships reach the bottom of the canvas, the alien invasion is successful and the game ends
- a special mystery ship will occasionally move across the top of the canvas, which gives an higher score if destroyed
- the laser cannon is partially protected by several bunkers, which can be destroyed by either the enemy ships or the laser cannon
- each bunker can take 4 hits before its destroyed
- you gain score by destroying the enemy ships
- you lose score as time passes by, and for each bullet fired

Controls
========

- move left - _a_ or _left arrow_
- move right - _d_ or _right arrow_
- fire - _left click_ or _space_

Dependencies
============

- [@drk4/game-engine](https://www.npmjs.com/package/@drk4/game-engine) : 3
- [@drk4/utilities](https://www.npmjs.com/package/@drk4/utilities) : 7
- typescript : 5

Development
===========

The node/pnpm versions are pinned in `.tool-versions` (managed with [mise](https://mise.jdx.dev/)).

    mise install       # install the pinned node/pnpm
    pnpm install       # install the dependencies

    pnpm dev           # start the development server
    pnpm build         # type-check and build to dist/
    pnpm preview       # serve the built files
    pnpm typecheck     # type-check only

    pnpm lint          # lint with oxlint
    pnpm lint:fix      # lint and apply the auto-fixes
    pnpm format        # format with prettier
    pnpm format:check  # check the formatting without writing

`.git-blame-ignore-revs` lists the mechanical reformat commits. To have `git blame`
skip them:

    git config blame.ignoreRevsFile .git-blame-ignore-revs
