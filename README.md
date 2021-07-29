# ChurchManagerUI - Angular

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

> Service workers do not work with `ng serve`! :stars: so we need a local web server 

`npm run build`

`npm run server`

```
You are able to pass in the docker environment variable ANGULAR_ENVIRONMENT if needed when its not Production
```

## Documentation

### Forms
- [Form Arrays](https://www.concretepage.com/angular/angular-formarray-validation#:~:text=FormArray%20tracks%20the%20value%20and,FormControl%20or%20FormGroup%20are%20validated.)
- [Responsive Sidebar](https://zoaibkhan.com/blog/create-a-responsive-sidebar-menu-with-angular-material/)
- [Material Trees](https://docs.google.com/presentation/d/1BoJ-jq-O9zQHAps7LVciiiH9WI9dDqqv-LAlQ6iMh5o/htmlpresent)


### AWS
- [Host angular web app in aws cloudfront](https://techpearl.com/blog/host-angular-web-app-in-aws-cloudfront/index.html)