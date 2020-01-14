---
title: SSH로 접속하기
category: 홈 서버 만들기
---

SSH를 활용하면 원격으로 시스템에 접속하여 쉘 세션을 사용할 수 있다.

* 목차
{:toc}

## 설치

아치 리눅스에서는 `pacman`으로 설치할 수 있다.

```
$ sudo pacman -S openssh
```

이후 `systemctl` 명령어로 서비스에 등록하여 사용하면 된다. `systemctl`은
리눅스 서비스를 관리하는 명령어이다.

`enable` 명령어로 서비스를 활성화할 수 있다. 활성화 된 서비스는 재시작 시 자동으로 시작한다.

`start` 명령어로 서비스를 바로 시작할 수 있다.

```
$ sudo systemctl enable sshd
$ sudo systemctl start sshd
```

`systemctl status` 명령어로 현재 상태를 볼 수도 있다.

```
$ sudo systemctl status sshd
● sshd.service - OpenSSH Daemon
     Loaded: loaded (/usr/lib/systemd/system/sshd.service; enabled; vendor preset: disabled)
     Active: active (running) since Mon 2020-01-13 17:36:59 KST; 6h ago
   Main PID: 18660 (sshd)
      Tasks: 1 (limit: 9324)
     Memory: 2.7M
     CGroup: /system.slice/sshd.service
             └─18660 /usr/bin/sshd -D
```

## 접속하기

클라이언트에서 `ssh` 명령어로 접속할 수 있다. 윈도우즈, 맥, 리눅스 뿐 아니라 아이패드나 휴대폰에서도
`ssh`가 지원되는 클라이언트면 접속할 수 있다.

```
$ echo $HOST
annyeong-devmachine.local

$ ssh annyeong@192.168.0.10
The authenticity of host 192.168.0.10 can't be established.
Are you sure you want to continue connecting (yes/no)?
```

처음 접속을 시도하면 접속하려는 서버를 신뢰할 수 없다고 한다. yes를 입력하여 진행하면
해당 서버에 대한 정보가 `~/.ssh/known_hosts`에 등록되어 다음번 접속시에는 물어보지 않는다.

```
Warning: Permanently added 192.168.0.10 (ECDSA) to the list of known hosts.
annyeong@192.168.0.10's password:
```

비밀번호를 입력해준다.

```
Last login: Mon Jan 13 23:46:34 2020 from 192.168.0.1

$ echo $HOST
uibox
```

이후 `$HOST` 변수를 확인해보면 제대로 접속했음을 알 수 있다 🥳

## SSH 보안 설정

현재는 같은 공유기를 사용하는 로컬 환경에서 접속하였다.
외부에서 접속할 수 있도록 설정하기 전에 보안 설정을 하자.

`sshd` 관련 설정은 `/etc/ssh/sshd_config` 파일을 수정하여 할 수 있다.
그건 어떻게 아냐구? `man sshd` 명령어로 `sshd` 메뉴얼을 보면 기본 설정 파일 경로가 저거라구
나와 있다.

옵션에 대한 자세한 설명은 `man sshd_config`를 참고하면 된다.

```conf
# /etc/sshd/sshd_config

# ssh 포트를 변경한다
Port 12345

# 루트 계정의 로그인을 차단한다.
PermitRootLogin no

# 비밀번호가 없는 계정으로의 로그인을 차단한다.
PermitEmptyPasswords no

# 접속 시도 횟수를 제한한다.
MaxAuthTries 3

# 로그인 시도 시간을 초 단위로 제한한다.
LoginGraceTime 30

# 접속 가능한 유저를 제한한다.
AllowUsers annyeong
```

`ssh` 프로토콜의 기본 포트는 22이다. 기본 포트를 그대로 사용하면 무차별적으로 IP를 골라 22번 포트로
접속을 시도하는 무차별 대입 공격(브루트 포스)에 노출되기 쉽다. 다른 포트로 바꾼 후, 로그인 시도를
모니터링 해서 주기적으로 포트를 바꾸는 것이 좋다고 한다.

## SSH 공개키로 로그인하기

매번 비밀번호를 입력하는 것은 불편하기도 하고 보안에도 권장되지 않는다고 한다. SSH 키를 이용하면
비밀번호를 입력하지 않고도 접속할 수 있다.

먼저 클라이언트에서 `ssh-keygen` 명령어로 공개키-비밀키 쌍을 만든다:

```
$ ssh-keygen -t ed25519 -a 100

Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/annyeong/.ssh/id_ed25519):
```

기본 디렉토리는 `~/.ssh`이며 여기에 두 개의 파일이 만들어진다. 일반적으로는 변경할 일 없이
엔터를 눌러 진행한다.

```
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
```

비밀번호를 넣어 디스크에 저장될 비밀키를 암호화 할 수 있다. 비우려면 그냥 엔터를 눌러 진행한다.

```
$ ls ~/.ssh
id_ed25519  id_ed25519.pub  known_hosts
```

`~/.ssh` 밑에 두 개의 파일이 생성된 것을 볼 수 있다.

비밀키인 `id_ed25519`는 절대 외부에 유출되어선 안되며, `.pub`가 붙은 `id_ed25519.pub`는
공개키로 서버에 복사할 파일이다.

만든 공개키를 서버에 복사하자. `ssh-copy-id` 명령어를 이용하면 편하게 복사할 수 있다.

```
$ ssh-copy-id annyeong@192.168.0.10 -p 12345
```

잘 복사가 되었다면 앞으로 서버에 접속할 때에는 암호를 입력하지 않아도 된다. 해당 서버에 접속하여
`~/.ssh/authorized_keys` 파일을 확인하면 알 수 있다.

```
$ cat .ssh/authorized_keys
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINZR0Yy/xNNzvky6YegOJFlyw/aWmgFFwoXyII73NsCe annyeong@annyeong-devmachine.local
```

## 방화벽 켜기

`iptables`는 리눅스 커널 방화벽 규칙을 설정하는 도구이다. `pacman`으로 설치한다.

```
$ sudo pacman -S iptables
```

`systemd` 서비스이므로 `systemctl`로 서비스를 활성화한다.

```
$ sudo systemctl enable iptables.service
```

### 기본 사용법

`-nvL` 옵션으로 현재 설정을 볼 수 있다.

```
$ iptables -nvL
```

설정을 저장하고 복구하려면 아래 두 명령어를 쓰면 된다.

```
$ iptables-save -f /etc/iptables/iptables.rules
$ iptables-restore /etc/iptables/iptables.rules
```

### 방화벽 규칙 초기화

아래 명령어로 기존 설정을 모두 지운다.

```
$ iptables -F
$ iptables -X
$ iptables -t nat -F
$ iptables -t nat -X
$ iptables -t mangle -F
$ iptables -t mangle -X
$ iptables -t raw -F
$ iptables -t raw -X
$ iptables -t security -F
$ iptables -t security -X
$ iptables -P INPUT ACCEPT
$ iptables -P FORWARD ACCEPT
$ iptables -P OUTPUT ACCEPT
```

### 특정 포트 열기

특정 포트로 들어오는 `tcp` 요청을 허용하려면 다음과 같이 설정한다:

```
$ sudo iptables -A INPUT -p tcp -m tcp --dport 12345 -j ACCPET
```

### 그 외의 접속 차단하기

```
$ sudo iptables -p INPUT DROP
$ sudo iptables -p FORWARD DROP
$ sudo iptables -p OUTPUT ACCEPT
```

## 접속 시도 확인하기

```
$ journalctl -u sshd | grep "Failed password"
```

## 참고

- [ssh 보안설정 -- 휘즈](https://phiz.kr/hosting/9427)
- [ssh 사용시 암호 대신 SSH key로 인증하기](https://arsviator.blogspot.com/2015/04/ssh-ssh-key.html)
