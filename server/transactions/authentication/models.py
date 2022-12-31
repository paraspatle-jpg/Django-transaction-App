from django.db import models

# Create your models here.


class Friends(models.Model):
    friend1 = models.IntegerField( blank=True)
    friend2 = models.IntegerField( blank=True)

    class Meta:
        unique_together = (("friend1", "friend2"),)
