# ChurchManagerUI - Angular

Church Manager frontend based on Angular Material

## AWS

Edit user attributes in AWS Cognito User Pool for specific user.

```
aws cognito-idp admin-update-user-attributes --user-pool-id us-east-1_i6pWJxu8q --username dillan --user-attributes Name="custom:picture",Value="https://secure.gravatar.com/avatar/6fdc48b6ec4d95f2fd682fc2982eb01b" --profile personal
```

## Running

### Docker

> docker build -t church-manager-ui:prod .

> docker run -p 4200:80 --name church-manager-ui  church-manager-ui:prod

```
You are able to pass in the docker environment variable ANGULAR_ENVIRONMENT if needed when its not Production
```

## Documentation

### FlexLayout

[basics](https://www.angularjswiki.com/flexlayout/basics/)

[responsive-app-angular](https://codinglatte.com/posts/angular/responsive-app-angular-flex-layout/)

### Forms
[Form Arrays](https://www.concretepage.com/angular/angular-formarray-validation#:~:text=FormArray%20tracks%20the%20value%20and,FormControl%20or%20FormGroup%20are%20validated.)