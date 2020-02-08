---
title: "zsh과 플러그인"
category: 맥 잘 쓰기
excerpt: zsh
---

`zsh`는 `bash` 대신 쓸 수 있는 쉘이다. 유용한 플러그인이 많아 편리하다.

* 목차
{:toc}

## 설치

macOS에 기본으로 `zsh`가 설치되어 있고, 카탈리나부터는 기본 쉘이기까지 하다. 그래도 brew로 깔면
brew로 버전 관리를 할 수 있다...!

```
brew install zsh
```

### PATH

`brew`로 설치 후 `where` 명령어로 확인해보면 두 가지 `zsh`이 있는 것을 볼 수 있다.
`/bin/zsh`는 macOS에 선 탑재된 `zsh`이고, `/usr/local/bin/zsh`는 `brew`로 깔린
`zsh`이다.

```
$ where zsh
/usr/local/bin/zsh
/bin/zsh
```

그럼 그냥 `zsh`라고만 쓰면 어떤 `zsh`가 실행될까? 궁금하다면 `which` 명령어로 알 수 있다.

```
$ which zsh
/usr/local/bin/zsh
```

정답은 `brew`로 깐 `zsh`이다. 그 이유는 `$PATH` 변수에서 찾을 수 있다. 유닉스, 리눅스, 윈도우즈
등등 대부분의 운영체제들은 명령어를 `$PATH` 변수에서 검색한다. `echo` 명령어로 `$PATH`의 내용을
출력해볼 수 있다.

```
$ echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

`zsh` 명령어를 입력하면 `$PATH` 변수에 입력한 디렉토리에서 차례로 그 명령어를 찾는다. 각
디렉토리는 `:`으로 구분되어 있다. 가장 먼저 `/usr/local/bin`에서 찾기 때문에 `brew`로 설치한
`zsh`이 먼저 실행된다.

선 탑재된 `zsh`이 쓰고 싶다면 절대경로를 쓰면 된다.

```
$ /bin/zsh --version
zsh 5.7.1 (x86_64-apple-darwin19.0)

$ /usr/local/bin/zsh --version
zsh 5.7.1 (x86_64-apple-darwin19.0.0)

$ zsh --version
zsh 5.7.1 (x86_64-apple-darwin19.0.0)
```

## zsh로 기본 쉘 바꾸기

`zsh`를 기본 쉘로 사용하려면 먼저 `/etc/shells` 파일에 `zsh`를 등록해야 한다.
`cat` 명령어로 `/etc/shells` 파일의 내용을 볼 수 있다.

```
$ cat /etc/shells
# List of acceptable shells for chpass(1).
# Ftpd will not allow users to connect who are not using
# one of these shells.

/bin/bash
/bin/csh
/bin/dash
/bin/ksh
/bin/sh
/bin/tcsh
/bin/zsh
```

우리가 쓰려는 `/usr/local/bin/zsh`을 추가해줘야 한다. `root` 권한이 필요한 파일이므로
`sudo`를 써야 한다. 터미널에 다음을 입력한다:

```
sudo sh -c 'echo $(which zsh) >> /etc/shells'
```

그 후 `chsh` 명령어로 사용자 기본 쉘을 바꿀 수 있다.

```
chsh -s $(which zsh)
```

이후 재시작하면 `zsh`로 시작하게 된다. 처음 `zsh`을 켜면 설정 마법사가 뜨는데, 키보드 `0`을 눌러
설정 파일인 `~/.zshrc`만 만들고 종료한다.

![](/images/zsh-newuser-install.png)

쉘이 제대로 바뀌었는지 확인해보려면 `$SHELL`의 값을 확인하면 된다.

```
$ echo $SHELL
/usr/local/bin/zsh
```

## 자동 완성

아래 두 명령어로 간단하게 자동완성을 켤 수 있다. `ls` 등의 명령어를 입력하고 탭을 두 번 누르면
방향키로 원하는 완성을 선택할 수 있다.

```
$ autoload -Uz compinit
$ compinit
```

![](/images/compinit.png)

`~/.zshrc` 파일을 열고 다음을 추가한다. `~/.zshrc` 파일의 내용은 쉘이 시작할 때마다 적용된다.

```zsh
# ~/.zshrc
autoload -Uz compinit
compinit
```

`.zshrc` 파일 변경 후 그 내용을 현재 쉘에 반영하려면 `.` 또는 `source` 명령어를 쓰면 된다:

```
. ~/.zshrc
```

## alias

자주 쓰는 명령어를 `~/.zshrc`에 `alias`로 등록하면 줄여서 쓸 수 있다.
나는 `ls`, `vim`, `cat`을 `exa`, `nvim`, `bat`으로 대체해서 쓰고 있기 때문에
아래와 같이 등록하였다:

```zsh
# ~/.zshrc
autoload -Uz compinit
compinit

alias mv='mv -i'
alias cp='cp -i'

# exa
alias ls='exa -F'
alias ll='exa -lhF'
alias la='exa -alhF'
alias lt='exa -lTF --git-ignore'
alias tree='exa -TF --git-ignore'

# neovim
alias vi='nvim'
alias vim='nvim'

# bat
alias cat='bat --paging never --plain'
```

## zplugin

플러그인을 깔고 지울 때 플러그인 관리자를 이용하면 훨씬 편리하다.
홈브루로도 설치 가능한 플러그인이 있지만, 수가 많지 않고 설치 후 추가 설정이 필요해서
귀찮다.

플러그인 관리자 종류가 엄청 많은데, 그 중에
[zplugin](https://github.com/zdharma/zplugin)이 빠르다고 소문나서 쓰고 있다.

### 설치

[README](https://github.com/zdharma/zplugin#option-1---automatic-installation-recommended)에서 하라는 대로 해준다.

```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/zdharma/zplugin/master/doc/install.sh)"
```

위 명령을 실행하면 `~/.zplugin` 폴더가 생기고 `zsh`의 설정 파일인 `~/.zshrc` 가장 밑에 다음의 세 줄이 추가된다.

```zsh
# ~/.zshrc
source "~/.zplugin/bin/zplugin.zsh"
autoload -Uz _zplugin
(( \${+_comps} )) && _comps[zplugin]=_zplugin

# 여기에 플러그인을 추가하면 된다

autoload -Uz compinit
compinit
```

문서를 읽어보면 플러그인을 추가 한 후에 자동 완성을 켜라고 나와있으므로 위와 같이 순서를 바꾸어주고
플러그인을 추가한다.

### 플러그인 추가하기

```
zplugin load [github 저장소 이름]
zplugin light [github 저장소 이름]
```

위 두 명령어로 플러그인을 추가할 수 있다.

`load`로 추가하면 플러그인을 추적한다. `zplugin report [플러그인 이름]` 명령어로 해당 플러그인의
설정을 볼 수도 있고, `zplugin unload [플러그인 이름]`으로 끌 수도 있다.

`light`는 그런 거 없는 대신 빠르다고 한다.

- [simnalamburt/zsh-expand-all](https://github.com/simnalamburt/zsh-expand-all): alias나 표현식을 입력하면 원래대로 바꿔서 보여준다. 편하다!
- [zdharma/fast-syntax-highlighting](https://github.com/zdharma/fast-syntax-highlighting): 구문을 강조하여 색칠해준다.
- [zsh-users/zsh-completions](https://github.com/zsh-users/zsh-completions): 더 많은 자동완성!
- [zsh-users/zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions): 명령어를 입력할 때 히스토리를 참고하여 도움을 준다.
- [zsh-users/zsh-history-substring-search](https://github.com/zsh-users/zsh-history-substring-search): 입력한 명령어에 기반하여 히스토리를 검색한다.

`~/.zshrc` 파일에 요렇게 추가하면 된다:

```zsh
# ~/.zshrc
source "~/.zplugin/bin/zplugin.zsh"
autoload -Uz _zplugin
(( \${+_comps} )) && _comps[zplugin]=_zplugin

zplugin light simnalamburt/zsh-expand-all
zplugin light zdharma/fast-syntax-highlighting
zplugin light zsh-users/zsh-completions
zplugin light zsh-users/zsh-autosuggestions
zplugin light zsh-users/zsh-history-substring-search

# zsh-users/zsh-history-substring-search는 키를 따로 바인딩해야한다.
# 일반적으로 키보드 위쪽 방향키인 ^[[A와 ^[[B를 바인딩한다.
bindkey '^[[A' history-substring-search-up
bindkey '^[[B' history-substring-search-down

autoload -Uz compinit
compinit
```

### 프롬프트 바꾸기

사용자의 명령을 기다리는 화면을 프롬프트라고 부른다. `zsh`을 깔고 아무 설정도 하지 않았다면
아래와 같다:

```
annyeong@annyeong-devmachine ~ %
```

`PROMPT` 변수를 고쳐 이를 바꿀 수 있다.

```
annyeong@annyeong-devmachine ~ % PROMPT="[$(whoami)] %#"
[annyeong] %
[annyeong] % PROMPT=$'\n'"%1~"$'\n'"[$(whoami)] %# "

~
[annyeong] %
```

`PROMPT` 변수 문법에 대한 자세한 내용은 아래 링크를 참고하고...

[Moving to zsh, part 6 – Customizing the zsh Prompt](https://scriptingosx.com/2019/07/moving-to-zsh-06-customizing-the-zsh-prompt/)

남이 만들어 둔 프롬프트를 깔 수도 있다.
[pure](https://github.com/sindresorhus/pure)는 깔끔하면서도 기능이 많은 프롬프트이다.
`git` 프로젝트에 들어가면 `git` 상태도 알려주고, 이전 명령어의 실행 시간도 알려준다.
`zplugin`으로 깔 수 있다:

```zsh
# ~/.zshrc
# ... 생략 ...
zplugin ice pick"async.zsh" src"pure.zsh"
zplugin light sindresorhus/pure
# ... 생략 ...
```

## 다른 설정 참고해보기

여기까지가 내 `zsh` 설정이다. 어떻게 해야 더 잘 쓸 수 있을지는:

- [Z shell](http://zsh.sourceforge.net) 저장소의 문서 읽기.
- GitHub에서 zshrc [검색해보기](https://github.com/search?o=desc&q=zshrc&s=stars&type=Repositories).

를 해보믄 된다 🙃

`.zshrc`처럼 `.`으로 시작하는 설정 파일을 흔히 `dotfile`이라고 한다.
`dotfiles`라고 검색해도 많이 나온다.

## 참고

- [Zplugin Wiki: Introduction](http://zdharma.org/zplugin/wiki/INTRODUCTION/)
