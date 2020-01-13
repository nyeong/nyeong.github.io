---
title: 아치 리눅스 올리기
category: 홈 서버 만들기
excerpt: 오드로이드에 아치 리눅스를 올렸습니다.
---

* 목을 발로 차면 목차
{:toc}

오드로이드 H2에는 운영체제가 탑재되어 있지 않다. x86 아키텍처이기 때문에 윈도우, 리눅스 등등 흔히 쓰던
운영체제를 깔아서 쓸 수 있다.

헤드리스 서버로 쓸 생각이기 때문에 비교적 익숙한 리눅스를, 그 중에서는 덜 익숙한 아치 리눅스를 깔려고
한다.

아치 리눅스를 설치할 오드로이드 H2에는

- NVMe M.2에 250GB SSD
- 8GB RAM 하나

를 연결한 상태이다.

## 아치 리눅스

[The Arch Way](https://wiki.archlinux.org/index.php/The_Arch_Way_(%ED%95%9C%EA%B5%AD%EC%96%B4))

아치 리눅스는 간결하고 빠르다고 한다. 깔 때 내가 설정하지 않은 것들은 전혀 깔리지 않아 간결하고,
롤링-릴리즈 시스템을 채택하여 새 버전의 패키지가 계속 올라와 가장 빠르게 최신 소프트웨어를 쓸 수 있다.

## 문서 준비하기

안 해본 일 할 때는 남 말 듣고 해야 한다. 대부분 필요한 내용은 아키 위치에 나와있다:

- [Installation guide](https://wiki.archlinux.org/index.php/Installation_guide)
- [General recommendations](https://wiki.archlinux.org/index.php/General_recommendations)
- [아치 리눅스 설치 가이드 -- Woohyung Jeon](https://withjeon.com/2017/11/07/arch-linux-install-guide/)

아래 네 가지가 필요하다:

- 부팅 가능한 USB 메모리
- USB로 연결 가능한 키보드
- DP, HDMI로 연결 가능한 모니터
- 유선 랜 연결

## 설치 파일 준비하기

[Arch Linux Downloads](https://www.archlinux.org/download/)에 들어가
최신 아치 리눅스 `iso` 파일을 받는다. 토렌트를 이용하는 편이 마음 편하다.

### 부팅 USB 메모리 만들기

`dd` 명령어 써도 되는데, 오드로이드 H2 문서에서 [Etcher](https://www.balena.io/etcher/)라는
앱을 쓰길래 그냥 한 번 써봤다. `brew cask`로 설치하고 GUI에서 실행한다.

```
brew cask install balenaetcher
```

`.iso`와 USB 메모리를 선택하고 Flash를 누르기만 하면 된다.

![](/images/balena-etcher-archlinux-flash.png)

## 설치 전 확인

### 부트 방식 확인

메인보드가 `UEFI`를 지원하는지 확인하려면 `efivars`가 있는지 확인하면 된다구 한다.
오드로이드 H2는 `UEFI` 부팅이 가능하다.

```
# ls /sys/firmware/efi/efivars
```

### 인터넷 연결 확인

유선 연결이 잘 되었는지 확인한다.

```
# ping archlinux.org
```

### 장치 연결 확인

SSD와 램이 제대로 인식되었는지 확인한다.

```
# fdisk -l
# free
```

## 파티셔닝

[Partitioning](https://wiki.archlinux.org/index.php/Partitioning)

어떻게 파티션을 나눌 것인지 계획한다. 나는 SSD를 시스템을 구축하여 개발용으로 사용하고
추후에 HDD 하나를 연결하여 데이터 저장용으로 사용할 계획이다.

리눅스 파티션에는 보통 세 파티션을 잡는 것이 기본이라고 한다.

- 부트: 부트로더가 들어갈 자리이다.
- 스왑: 물리 메모리가 부족할 경우 가상 메모리로 쓰기 위하여 예약되는 공간이다.
- 루트: 나머지가 저장될 자리.

스왑 영역의 경우 읽기/쓰기 작업이 빈번하여 SSD에서 사용하면 SSD의 수명을 갉아먹는다고 한다.
따라서 스왑 없이 파티셔닝 하였다.

NVMe 방식으로 SSD가 연결되어 있으므로 `/dev/nvme0n1`을 파티셔닝 하면 된다.

```
# cfdisk /dev/nvme0n1
```

`cfdisk`로 다음과 같이 세팅한다:

- `/dev/nvme0n1p1` 512MiB EFI System
- `/dev/nvme0n1p2` 100GiB Linux filesystem
- `/dev/nvme0n1p3` 138GiB Linux filesystem

위부터 차례로 부트, 루트, 홈으로 쓸 영역이다.

### 포맷

`mkfs` 명령어로 각각의 파티션을 적절한 파일 시스템으로 포맷한다.

부팅 파티션은 `nvme0n1p1`은 FAT32로, 나머지는 ext4로 포맷한다.

```
# mkfs.vfat -F32 /dev/nvme0n1p1
# mkfs.ext4 /dev/nvme0n1p2
# mkfs.ext4 /dev/nvme0n1p3
```

`fdisk -l`로 잘 되었는지 확인한다.

### 마운트

시스템이 설치된 후 루트(`/`)가 되는 디렉토리가 바로 `/mnt` 디렉토리이다. 여기에 방금 포맷한
파티션을 마운트해야한다.

루트 디렉토리가 될 공간이므로 루트 파티션인 `nvme0n1p2`를 마운트해야한다!

```
# mount /dev/nvme0n1p2 /mnt
```

부트 파티션과 홈 파티션을 마운트 할 공간을 만들고...

```
# mkdir /mnt/boot
# mkdir /mnt/home
```

나머지도 마운트한다.

```
# mount /dev/nvme0n1p1 /mnt/boot
# mount /dev/nvme0n1p3 /mnt/home
```

마운트가 끝나면 대략 이런 모양새인 셈이다:

```
/mnt (nvme0n1p2)
├── boot (nvme0n1p1)
└── home (nvme0n1p3)
```

## 설치하기

시스템 준비가 완료되었고, 이제 저장소에서 필요한 패키지를 다운 받아 설치할 차례이다.

### 미러 선택하기

설치할 패키지를 미러 서버에서 찾는데, 이 목록은 `/etc/pacman.d/mirrorlist`에 있다.
위에서부터 순서대로 접속을 시도하므로 가장 빠른 미러서버를 위에 올려두는 것이 좋다.

[한국 미러리스트](https://www.archlinux.org/mirrorlist/?country=KR&protocol=http&protocol=https&ip_version=4&use_mirror_status=on)

위 링크에서 한국 미러리스트의 주소를 확인하여 주석을 제거한 후 `vi`나 `nano` 등의 편집기로
`/etc/pacman.d/mirrorlist`의 제일 앞에 추가하면 된다.

```
Server = https://ftp.harukasan.org/archlinux/$repo/os/$arch
Server = https://ftp.lanet.kr/pub/archlinux/$repo/os/$arch
Server = http://ftp.lanet.kr/pub/archlinux/$repo/os/$arch
Server = http://mirror.premi.st/archlinux/$repo/os/$arch
Server = http://ftp.harukasan.org/archlinux/$repo/os/$arch
```

하루카상이라는 수상한 이름의 서버가 있는데, 부경대학교 정보 및 데이터베이스 시스템 연구실에서 운영하는
서버이다. 하루카상 고마워!

### base 패키지 설치하기

`pacstrap`을 이용하여 필요한 패키지를 설치해준다.

```
# pacstrap /mnt base base-devel linux linux-firmware neovim
```

이 때 원하는 패키지를 설치할 수 있다. 나는 편집할 때 `neovim` 쓰고 싶어서 함께 깔았다.

## 시스템 설정

이제 설치된 시스템 내부로 진입하여 시스템 설정을 진행할 차례이다.

### fstab

시스템에게 파일 시스템이 어떻게 마운트되어있는지 알려주기 위하여 `fstab` 파일을 만든다.

```
# genfstab -U /mnt >> /mnt/etc/fstab
```

### 시스템 내부로 진입하기

`arch-chroot` 명령어로 새롭게 설치한 시스템 내부로 들어간다.

```
# arch-chroot /mnt
```

들어가자마자 루트 패스워드를 설정해준다.

```
# passwd
```

### 시간대 설정

`/usr/share/zoneinfo/지역/도시`에 시간대 설정 파일이 있다. 이를 `/etc/localtime`으로
연결해준다.

```
# ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
```

그 후 `hwclock`으로 시간을 동기화해준다.

```
# hwclock -w
```

`date`로 시간을 확인해본다.

### 지역화

`/etc/locale.gen` 파일에서 `en_US.UTF-8 UTF-8`을 찾아 주석 해제한다.
저장 후 `locale-gen`을 실행한다.

```
# locale-gen
```

`/etc/locale.conf` 파일을 만들어 언어 관련 변수인 `LANG`과 `LC_ALL` 변수를 설정해준다.

```
# /etc/locale.conf
LANG=en_US.UTF-8
LC_ALL=en_US.UTF-8
```

### 호스트 이름 설정

`/etc/hostname` 파일을 만들어 컴퓨터 이름을 설정해준다. 나는 uibox라고 등록했다.

```
# echo uibox > /etc/hostname
```

어떤 프로그램은 호스트 이름을 찾으려고 `/etc/hosts` 파일을 참조한다고 한다. 이 파일도 고쳐준다.

```
# /etc/hosts
127.0.0.1 localhost.localdomain localhost
::1       localhost.localdomain localhost
127.0.1.1 uibox.localdomain     uibox
```

### 사용자 추가

루트 계정을 그대로 쓰는 것 보다 새로운 사용자를 만드는 편이 낫다.

```
# useradd -m -g users -G wheel -s /bin/bash annyeong
```

- `-m`: 홈폴더 자동 생성
- `-g users`: 이 계정을 users 그룹에 primary group으로 추가
- `-G wheel`: 이 계정을 wheel 그룹에 추가
- `-s /bin/bash`: `bash`를 기본쉘로 설정

그 이후 권한 부여를 위해 `visudo` 명령어로 권한을 수정해준다.

```
# EDITOR=nvim visudo
```

`%wheel`로 시작하는 줄을 찾아 아래처럼 주석을 제거해준다.

```
##
## User privilege specification
##
root ALL=(ALL) ALL

## Uncomment to allow members of group wheel to execute any command
%wheel ALL=(ALL) ALL
```

### 부팅 설정

[systemd-boot](https://wiki.archlinux.org/index.php/Systemd-boot)

```
# bootctl --path=/boot install
```

```
# /boot/loader/loader.conf
default arch
timeout 3
```

```
# /boot/loader/entries/arch.conf
title Arch Linux
linux /vmlinuz-linux
initrd /initramfs-linux.img
options root=/dev/nvme0n1p2 rw
```

### 네트워크 활성화

```
# systemctl enable dhcpcd
```
