# YoYoClicker


##Config for dev
create file ./config/dev.ts(copy of example)
change mongoURL as desired

##Setup
1. Install node

2. Use node version 11.xx
check with
```
node --version
```

3. node version manager
- for *nix based SO install version using n: 
```
npm install -g n
sudo n install 11
````

- for windows
https://github.com/coreybutler/nvm-windows


## Cliend e Backend Server on development mode
> Start local service
Open 2 terminals
1. Client(goto ./client folder)
```
cd ./client
npm install
npm start
````


2. server(root folder)
```
npm run dev
```

##usage

login with adminstrator to acess administrator feature
login with judge to judge
