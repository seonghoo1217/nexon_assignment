# 2025 Nexon 웹 백엔드 과제 전형

## 프로젝트 개요
해당 프로젝트는 NestJS, MongoDB, 그리고 마이크로서비스 아키텍처(MSA)를 활용하여 이벤트 보상 시스템을 구현한 백엔드 애플리케이션입니다. 
사용자는 이벤트에 참여하고 보상을 요청할 수 있으며, 관리자는 이벤트를 생성하고 보상을 관리할 수 있습니다.

## 주요 기능 구현
- **JWT 기반 인증 및 인가 시스템**: 안전한 사용자 인증과 역할 기반 접근 제어
- **역할 기반 권한 관리**: 사용자, 운영자, 감사자, 관리자 역할에 따른 기능 접근 제어
- **이벤트 및 보상 관리**: 이벤트 생성, 보상 정의, 보상 요청 처리
- **마이크로서비스 아키텍처**: 세 개의 독립적인 서비스(Gateway, Auth, Event)로 구성된 확장 가능한 시스템

## 아키텍처 개요
이 프로젝트는 마이크로서비스 아키텍처를 기반으로 세 개의 주요 서비스로 구성되어 있습니다:

1. **Gateway Server**: 모든 API 요청의 진입점으로, 인증 및 권한 검사를 수행하고 요청을 적절한 마이크로서비스로 라우팅합니다.
2. **Auth Server**: 사용자 관리, 인증, 권한 관리, JWT 토큰 발급을 담당합니다.
3. **Event Server**: 이벤트 생성, 보상 정의, 보상 요청 처리, 보상 상태 관리를 담당합니다.

각 서비스는 독립적으로 실행되며, TCP 기반의 마이크로서비스 통신을 통해 상호작용합니다.

## 프로젝트 구조
```
repo-root/
├── src/
│   ├── apps/
│   │   ├── auth/                   ← Auth 마이크로서비스
│   │   │   └── src/
│   │   │       ├── main.ts         # NestFactory.createMicroservice
│   │   │       ├── app.module.ts
│   │   │       └── module/
│   │   │           ├── controllers/
│   │   │           │   └── rpc/    # Gateway → RPC 통신용
│   │   │           ├── services/   # 비즈니스 로직
│   │   │           └── schemas/    # Mongoose 스키마
│   │   │
│   │   ├── event/                  ← Event 마이크로서비스
│   │   │   └── src/
│   │   │       ├── main.ts         # NestFactory.createMicroservice
│   │   │       ├── app.module.ts
│   │   │       └── modules/
│   │   │           └── event/
│   │   │               ├── controllers/ # RPC 핸들러
│   │   │               └── schemas/     # Mongoose 스키마
│   │   │
│   │   └── gateway/                ← HTTP Gateway 서버
│   │       └── src/
│   │           ├── main.ts         # NestFactory.create()
│   │           ├── app.module.ts
│   │           └── modules/
│   │               ├── auth/       # HTTP → RPC 중개 모듈
│   │               │   ├── controllers/
│   │               │   │   └── http/ # 클라이언트용 API 컨트롤러
│   │               │   ├── decorators/ # @Roles() 등
│   │               │   ├── guards/     # JwtAuthGuard, RolesGuard
│   │               │   └── strategies/ # JwtStrategy 등
│   │               │
│   │               ├── gateway/    # 공통 라우팅 · 미들웨어
│   │               │   └── controllers/
│   │               │       └── gateway.controller.ts
│   │               │
│   │               └── health/     # 헬스체크 전용 모듈
│   │                   └── controllers/
│   │                       └── health.controller.ts
│   │
│   └── common/                     ← 공통 모듈
│       ├── exceptions/             # 커스텀 예외 클래스
│       └── filters/                # 예외 필터
│
├── nest-cli.json                   # Monorepo 설정
├── tsconfig.json
├── package.json
└── docker-compose.yml              # Docker 배포 설정
```

## 기술 스택
- **백엔드 프레임워크**: NestJS
- **데이터베이스**: MongoDB
- **인증**: JWT (JSON Web Tokens)
- **통신**: TCP 기반 마이크로서비스
- **배포**: Docker, Docker Compose


## Docker 환경구성
현재 구조는 GateWay Server(port:8000)에서 모든 요청을 처리받아 이를 내부 TCP를 통해 각각 Auth와 Evnet 서버로 전달해줍니다.
그렇기에 현재 Docker Compose 파일을 이용하여 8000,8001,8002 각각의 포트번호를 local 환경에 띄운 후  8000 포트로 Client와 통신합니다.

## 실행 방법
### 환경 변수 설정
루트 디렉토리 밑에 `.env` 파일을 생성하고 아래 요소를 붙여넣으시면 됩니다.

```
MONGO_URI=mongodb+srv://nexon_assignment:assignment_freetier@nexon.7fe6nno.mongodb.net/?retryWrites=true&w=majority&appName=nexon
PORT=8000
JWT_SECRET=nexon_auth_secret_key
AUTH_SERVICE_HOST=auth-service
AUTH_SERVICE_PORT=8001

EVENT_SERVICE_HOST=event-service
EVENT_SERVICE_PORT=8002
```

### 도커 실행
이후 Docker Compose를 실행합니다.
```bash
# 빌드 및 실행
docker-compose up --build

# 백그라운드에서 실행
docker-compose up -d
```

## 서비스 상세 설명

### 1. Auth Server
Auth Server는 사용자 관리, 인증, 권한 관리를 담당하는 마이크로서비스입니다.

#### 1-1. User Schema 설계
```json
{
    "_id": "ObjectId",
    "username": "string",
    "password": "string(hashed)",
    "roles": ["String"],
    "refreshToken": "string",
    "refreshTokenExpiry": "Date"
}
```

#### 1-2. API 목록
- **회원가입** (`/auth/signup`): 새로운 사용자 등록
- **로그인** (`/auth/signin`): 사용자 인증 및 JWT 토큰 발급
- **유저 정보 조회** (`/auth/users/{userId}`): 특정 사용자 정보 조회 (관리자/감사자 전용)
- **권한 수정** (`/auth/users/{userId}/roles`): 사용자 역할 변경 (관리자 전용)
- **내 정보 조회** (`/auth/me`): 현재 인증된 사용자 정보 조회
- **토큰 갱신** (`/auth/refresh`): 리프레시 토큰을 사용한 액세스 토큰 갱신
- **로그아웃** (`/auth/logout`): 사용자 로그아웃 및 리프레시 토큰 무효화

### 2. Event Server
Event Server는 이벤트 생성, 보상 정의, 보상 요청 처리를 담당하는 마이크로서비스입니다.

#### 2-1. Schema 설계

##### Event Schema
```json
{
    "_id": "ObjectId",
    "name": "string",
    "description": "string",
    "conditions": "string",
    "startDate": "Date",
    "endDate": "Date",
    "status": "string (active/inactive)"
}
```

##### Reward Schema
```json
{
    "_id": "ObjectId",
    "name": "string",
    "description": "string",
    "type": "string (point/item/coupon)",
    "quantity": "number",
    "eventId": "ObjectId"
}
```

##### RewardRequest Schema
```json
{
    "_id": "ObjectId",
    "userId": "string",
    "rewardId": "ObjectId",
    "status": "string (pending/approved/rejected/completed)",
    "approvedBy": "string",
    "approvedAt": "Date",
    "rejectionReason": "string"
}
```

#### 2-2. API 목록
- **이벤트 생성** (`/events/create`): 새로운 이벤트 생성 (운영자/관리자 전용)
- **보상 정의** (`/events/rewards/define`): 이벤트에 대한 보상 정의 (운영자/관리자 전용)
- **보상 요청** (`/events/rewards/request`): 사용자가 이벤트 보상 요청
- **보상 내역 조회** (`/events/rewards/history`): 보상 요청 내역 조회 (감사자/관리자 전용)
- **특정 보상 상세 조회** (`/events/rewards/{id}`): 특정 보상 요청 상세 정보 조회 (감사자/관리자 전용)

### 3. Gateway Server
Gateway Server는 모든 API 요청의 진입점으로, 인증 및 권한 검사를 수행하고 요청을 적절한 마이크로서비스로 라우팅합니다.

#### 3-1. 주요 기능
- JWT 토큰 검증 (`JwtAuthGuard`)
- 역할 기반 접근 제어 (`RolesGuard`)
- 요청 라우팅 및 마이크로서비스 통신
- 헬스 체크 API 제공

#### 3-2. 사용자 역할(Role)
- **USER**: 보상 요청 가능
- **OPERATOR**: 이벤트/보상 등록 가능
- **AUDITOR**: 보상 이력 조회만 가능
- **ADMIN**: 모든 기능 접근 가능

## 에러 처리
프로젝트는 중앙 집중식 에러 처리 메커니즘을 구현하여 일관된 에러 응답을 제공합니다:

- **CustomException**: 모든 커스텀 예외의 기본 클래스
- **HttpExceptionFilter**: HTTP 예외를 처리하는 글로벌 필터
- **RpcToHttpExceptionFilter**: 마이크로서비스 RPC 예외를 HTTP 예외로 변환하는 필터

## 헬스 체크
각 서비스는 `/health` 엔드포인트를 제공하여 서비스 상태를 모니터링할 수 있습니다:

- Gateway Server: `GET /health`
- Auth Server: 내부 헬스 체크 (Gateway를 통해 접근)
- Event Server: 내부 헬스 체크 (Gateway를 통해 접근)

## 보안 고려사항
- 비밀번호는 bcrypt를 사용하여 해싱됩니다.
- JWT 토큰은 짧은 만료 시간을 가지며, 리프레시 토큰을 통해 갱신할 수 있습니다.
- 모든 API 엔드포인트는 적절한 권한 검사를 통해 보호됩니다.
- 환경 변수를 통해 민감한 정보를 관리합니다.

## Trouble Shooting
MSA 구조를 만들 시 각각의 서버에대한 Host를 `localhost`가 아닌 `0.0.0.0`으로 설정했습니다.

그 이유는 localhost로 설정 시 docker의 localhost 주소가 잡히기에 모든 통신이 가능하도록 임의로 GatewayServer에서 TCP로 접근가능하도록 만들었습니다.

직접적인 포트연결(8001,8002)은 불가하게 설정했습니다.