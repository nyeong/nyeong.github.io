---
title: "Homebrew: 패키지 관리자"
excerpt: homebrew 설치하기
category: 맥 잘 쓰기
---

[homebrew](https://brew.sh)는 macOS에서 사실상의 표준[^1]으로 통하는 패키지 관리자이다.
homebrew를 깔면 명령어로 터미널 앱이나 GUI 앱을 편리하게 깔고 업데이트하고 지울 수 있다.

* 목차
{:toc}

[^1]: 있어 보이게 말하려면 *de facto standard*라고 하면 된다.

## 설치

먼저 Xcode 명령어 도구를 설치해야한다. homebrew 설치에 필요한 도구들이 포함되어 있다. 터미널을 열고
다음을 입력한다:

```
sudo xcode-select --install
```

잘 깔렸는지 보려면 `clang --version`을 해보면 된다.

```
$ clang --version
Apple clang version 11.0.0 (clang-1100.0.33.16)
Target: x86_64-apple-darwin19.2.0
Thread model: posix
InstalledDir: /Library/Developer/CommandLineTools/usr/bin
```

이후 [homebrew](https://brew.sh)에서 하라는 대로 해준다.

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

잘 깔렸는지 확인해보려면 `brew`를 쳐보면 된다.

```
$ brew doctor
Your system is ready to brew.
```

## 명령어

그냥 `brew`만 치면 어떤 명령어가 있는지 친절하게 알려주는 도움말이 뜬다. 더 자세한 사용법이 알고 싶다면
`brew [명령어] --help`를 치면 된다.

brew로 깔고 지우는 것들을 formula라고 한다. 무언가를 깔 때에는 다음과 같이 하면 된다:

- `brew update`로 저장소를 최신으로 업데이트 하고
- `brew search [검색어]`로 내가 깔고 싶은 formula를 찾아서
- `brew info [formula]`로 내가 찾은 게 맞는지 확인하고
- `brew install [formula]`로 설치한다.

무언가를 지울 때에는 다음과 같이 하면 된다:

- `brew list`로 내가 깐 formula를 보고
- `brew uninstall [formula]` 하믄 된다.

brew 상태를 보려면 다음 명령어를 쓰면 된다:

- `brew doctor`로 brew에 이상이 없는지 보고
- `brew outdated`로 업데이트가 필요한 formula 목록을 보고
- `brew upgrade [formula]`로 원하는 formula를 업데이트한다.

## 추천 터미널 앱

- [zsh]({% post_url 2020-01-11-zsh %}), `bash` 대신 쓸 수 있는 쉘.
- neovim, `vim` 대신 쓸 수 있는 편집기.
- fzf, fuzzy finder.
- tmux, terminal multiplexer.

### tldr

TL;DR은 영어 채팅용어로 대충 세 줄 요약이라는 뜻이다. [tldr](http://tldr.sh)은 명령어 사용법을 간단히 알고 싶을 때 유용한
도움말이다.

```
brew install tldr
```

`tldr [명령어]`로 찾아보면 된다. 예를 들어 `ln`이 뭔지 궁금하다면:

```
$ tldr ln

ln

Creates links to files and directories.

- Create a symbolic link to a file or directory:
    ln -s path/to/file_or_directory path/to/symlink

- Overwrite an existing symbolic to point to a different file:
    ln -sf path/to/new_file path/to/symlink

- Create a hard link to a file:
    ln path/to/file path/to/hardlink
```

### bat

[bat](https://github.com/sharkdp/bat)는 `cat` 대신 쓸 수 있는 명령어이다. 문법 강조가 지원되어서 더 보기 편하다.

```
brew install bat
```

사용법은 간단하다. `cat`처럼 쓰면 된다.

![bat usecase](/images/bat.png)

`--plain` 옵션을 붙이면 줄 번호 등을 없애준다. `alias`로 등록해두면 `cat`을 대체할 수 있다.

```
$ alias cat='bat --plain --paging never'
$ cat README.md
# 우리집 `cat`은 코드 하이리이팅 된다~
```

### exa

[exa](https://the.exa.website)는 `ls`를 대체할 수 있는 명령어이다. 가독성이 더 좋고,
트리 뷰까지 지원한다.

```zsh
# ~/.zshrc
alias ls='exa -F'
alias ll='exa -lhF'
alias la='exa -alhF'
alias lt='exa -lTF'
alias tree='exa -TF'
```

`-T` 옵션을 쓰면 디렉토리 구조를 트리 형태로 볼 수 있다. 프로젝트 구조를 한 눈에 파악할 때 좋다.

기본적으로 색상으로 파일의 종류를 구분해주는데, 추가로 `-F` 옵션을 주면 파일명 끝에 디렉토리일 경우
`/`를, 실행 가능한 파일인 경우 `*`를 붙여주어 읽기 편해진다.

```
$ exa -TF spring-petclinic -L 3
spring-petclinic/
├── push-to-pws/
│  └── button.yml
├── src/
│  ├── main/
│  │  ├── java/
│  │  ├── less/
│  │  ├── resources/
│  │  └── wro/
│  └── test/
│     ├── java/
│     └── jmeter/
├── target/
├── docker-compose.yml
├── mvnw*
├── mvnw.cmd
├── pom.xml
└── readme.md
```

### neofetch

[neofetch](https://github.com/dylanaraps/neofetch)는 터미널 계의 이-Mac에-관하여이다. 한 눈에 시스템 정보를 볼 수 있다.

```
brew install neofetch
```

![](/images/neofetch.jpg)

### fd

[fd](https://github.com/sharkdp/fd)는 `find` 대신 쓸 수 있는 검색 명령어이다.
검색 속도도 더 빠르고 쓰기도 쉽고 출력도 깔끔하다. 예를 들어 `Developments` 폴더에서
`js` 파일을 찾고 싶다면 아래처럼 하면 된다:

```
$ fd 'js$' Developments
Developments/farmer-cat/index.js
Developments/farmer-cat/src/update_notices.js
```

### hyperfine

[hyperfine](https://github.com/sharkdp/hyperfine)은 CLI 벤치마킹 도구이다.
벤치마킹 용도로 `time` 대신 쓸 수 있다.

```
$ hyperfine "fd 'md$' ~/Developments"
Benchmark #1: fd 'md$' ~/Developments
  Time (mean ± σ):      10.0 ms ±   0.6 ms    [User: 13.2 ms, System: 18.4 ms]
  Range (min … max):     9.1 ms …  13.3 ms    184 runs

$ hyperfine "find ~/Developments -iregex 'md$'"
Benchmark #1: find ~/Developments -iregex 'md$'
  Time (mean ± σ):      45.6 ms ±   1.6 ms    [User: 9.8 ms, System: 35.0 ms]
  Range (min … max):    41.2 ms …  49.4 ms    63 runs
```

### pstree

`pstree`는 실행 중인 프로세스를 트리 형태로 보여주는 명령어이다.

### httpie

[HTTPie](http://httpie.org)는 cURL 대신 쓸 수 있는 HTTP 클라이언트이다.

```
brew install httpie
```

[httpie - curl을 대체할 http client 유틸리티](https://www.lesstif.com/pages/viewpage.action?pageId=28606741)

다음 명령어는 랜덤으로 고양이 사진을 다운받는다:

```
http -d placekitten.com/200/300 --output cat.jpg
```


### cowsay

```
brew install cowsay
```

소에게 말을 시킬 수 있다.

```
$ cowsay '러스트 아십니까? 정말 갓언어입니다!'
 ________________________________
/ 러스트 아십니까? 정말 \
\ 갓언어입니다!            /
 --------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

```

코끼리한테도 시킬 수 있다.

```
$ cowsay -f elephant 'PHP는 부활해서 1위를 탈환할 언어다!'
 _______________________________________
/ PHP는 부활해서 1위를 탈환할 \
\ 언어다!                            /
 ---------------------------------------
 \     /\  ___  /\
  \   // \/   \/ \\
     ((    O O    ))
      \\ /     \ //
       \/  | |  \/
        |  | |  |
        |  | |  |
        |   o   |
        | |   | |
        |m|   |m|
```

이 자체로는 의미가 없어 보일 수 있다. 이 명령어는 `fortune`과 함께 써야 의미가 있다.

### fortune

```
brew install fortune
```

랜덤으로 좋은 말을 해준다.

```
$ fortune
Anger kills as surely as the other vices.
```

`cowsay`와 함께 쓰면 좋다.

```
$ fortune | cowsay
 ____________________________________
/ Whom the gods wish to destroy they \
\ first call promising.              /
 ------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

### lolcat

```
brew install lolcat
```

출력을 아름답게 바꿔준다.

이 명령어로 `fortune`과 `cowsay`를 완성할 수 있다.

![](/images/fortune-cowsay-lolcat.png)
