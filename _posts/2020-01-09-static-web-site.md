---
title: 정적 웹 사이트
category: 블로그 만들기
---

블로그를 만든다 하면 크게 세 가지 선택지가 있다:

1. 블로그 서비스를 이용한다.
2. 블로그 서버를 운용한다.
3. 정적 웹 사이트를 만들어 호스팅한다.

시중에 네이버 블로그, 티스토리 같은 블로그 뿐 아니라
[dev.to](https://dev.to)나 [velog.io](http://velog.io) 같은, 프로그래머를 대상으로 하는
블로그 서비스가 많다. 이런 서비스를 이용하면 편리하게 글 쓰는 데에만 집중할 수 있으나
내가 무언가를 바꿔볼 여지는 좀 적다.

블로그 서버를 직접 운용할 수도 있다. 워드프레스나 [ghost](https://ghost.org) 같은 블로그
CMS를 서버에 직접 설치하여 운용할 수 있다. 정말 하고 싶은 대로 할 수 있지만 유지하고 관리하는 데에
돈 뿐만 아니라 시간도 들여야 한다.

차선책으로 정적 웹 사이트를 만들어 호스팅하는 방법이 있다.

앞서 열거한 다른 방법은 모두 **동적 웹 사이트**이다. 동적 웹 사이트는 서버가 요청을 받았을 때 비로소
응답, HTML 문서가 만들어진다. 이와 반대로 미리 응답을 만들어 두는 웹 사이트를 정적 웹 사이트라고 한다.

일반적인 웹 사이트는 댓글이 쓰거나 지우고, 글을 올리고 내리는 등 사용자와의 상호작용이 존재하기 때문에
동적 웹 사이트일 수 밖에 없다. 그러나 단순한 형태의 블로그는 사용자와의 상호작용이 적기 때문에
-- 거칠게 말해서 읽을 수만 있다면 상관 없으니까 -- 정적 웹 사이트여도 괜찮다.

정적 웹 호스팅은 무료로 해주는 곳이 많으므로
서버 관리에 신경쓰지 않아도 되고, 결과물이 정적인 파일이라면 뭐든 괜찮기 때문에 모두 내 마음대로
할 수 있다.

## 정적 웹 호스팅

- GitHub Pages
- GitLab Pages
- Netlify
- Firebase
- Google App Engine
- 등등...

이 이외에도 많지만 어차피 계정이 있는 GitHub Pages 쓸 거라 더 찾아보진 않았다. 🙃
대여폭과 저장소 등에서 차이가 있지만 유의미하진 않은 것 같다.

## GitHub Pages

GitHub Pages를 쓰는 방법은 [공식 홈페이지](https://pages.github.com)에 잘 나와있다.

먼저 계정을 대표하는 웹 페이지를 호스팅하려면:

1. `계정이름/계정이름.github.io` 저장소를 만들고
1. html 파일을 넣으면
1. `https://계정이름.github.io`에 호스팅 된다.

저장소 별로도 웹 페이지를 만들 수 있다:

1. `계정이름/저장소이름` 저장소가 있다면
1. 해당 저장소의 `master` 브랜치의 `docs` 폴더나, `gh-pages` 브랜치에 html 파일을 넣으면
1. `https://계정이름.github.io/저장소이름`에 호스팅 된다.

내 계정명이 `nyeong`이므로
[nyeong/nyeong.github.io](https://github.com/nyeong/nyeong.github.io) 저장소를
만들면, [nyeong.github.io](https://nyeong.github.io)에 호스팅 된다.

먼저 [github.new](https://github.new)에 접속하여 저장소를 만든다.

![GitHub 저장소 생성 이미지](/images/create-github-repository.png)

`git clone` 명령어로 저장소를 로컬에 복제한다.

```
$ git clone https://github.com/nyeong/nyeong.github.io.git
'nyeong.github.io'에 복제합니다...
remote: Enumerating objects: 3, done.
remote: Counting objects: 100% (3/3), done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
오브젝트 묶음 푸는 중: 100% (3/3), 완료.
```

복제한 저장소 안에 다음과 같은 내용을 `index.html`로 저장한다.

```html
<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="UTF-8">
  <title>Hello GitHub Pages</title>
</head>

<body>
  <div style="text-align: center">
    <h1 style="margin-top: 30px">
      Hello GitHub Pages
    </h1>
    <p>와 신난다</p>
  </div>
</body>

</html>
```

이 내용을 커밋 후 푸시한다.

```
$ git add index.html
```
