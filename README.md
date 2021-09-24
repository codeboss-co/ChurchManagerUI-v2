# ChurchManagerUI - Angular

Test: [![Netlify Status](https://api.netlify.com/api/v1/badges/b4fb3361-8503-409a-a30c-c792e6740972/deploy-status)](https://app.netlify.com/sites/churchmanager-test/deploys)

Prod: [![Netlify Status](https://api.netlify.com/api/v1/badges/6b92198d-66b1-4dac-9466-74cf906d305d/deploy-status)](https://app.netlify.com/sites/churchmanager/deploys)

Church Manager frontend based on Angular Material

## Running

> ng serve

## Locally with domain

 - Open the hosts file `C:\Windows\System32\drivers\etc\hosts`
 - Add `127.0.0.1 localhost test-churchmanager.codeboss.tech` (remove other entries if there are)
 - Build and run as `Service worker` below
 - Accessible at  `http://test-churchmanager.codeboss.tech:8080`

### Docker

> docker build -t church-manager-ui:prod .

> docker run -p 4200:80 --name church-manager-ui  church-manager-ui:prod

### Service worker

> Service workers do not work with `ng serve`, so we need a local web server 

`ng build --configuration local` -> for localhost backend

`npm run server`

```
You are able to pass in the docker environment variable ANGULAR_ENVIRONMENT if needed when its not Production
```

## Documentation

### Forms
- [Form Arrays](https://blog.sreyaj.dev/implement-complex-forms-in-angular-using-formarray)
- [Form Arrays Validation](https://www.concretepage.com/angular/angular-formarray-validation#:~:text=FormArray%20tracks%20the%20value%20and,FormControl%20or%20FormGroup%20are%20validated.)
- [Responsive Sidebar](https://zoaibkhan.com/blog/create-a-responsive-sidebar-menu-with-angular-material/)

### Material
- [Material Trees](https://docs.google.com/presentation/d/1BoJ-jq-O9zQHAps7LVciiiH9WI9dDqqv-LAlQ6iMh5o/htmlpresent)
- [Material Table](https://pretagteam.com/question/matsort-and-matpaginator-not-working-on-angular-material-mattable)


### AWS
- [Host angular web app in aws cloudfront](https://techpearl.com/blog/host-angular-web-app-in-aws-cloudfront/index.html)

### Service worker

- [Angular’s PWA: SwPush and SwUpdate](https://arjenbrandenburgh.medium.com/angulars-pwa-swpush-and-swupdate-15a7e5c154ac)
- [Configure ngsw-config.json](https://newbedev.com/angular-5-and-service-worker-how-to-exclude-a-particular-path-from-ngsw-config-json)