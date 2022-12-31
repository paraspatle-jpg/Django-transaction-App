from django.db import models

# Create your models here.


class Transaction(models.Model):
    date = models.DateField(blank=False)
    description = models.CharField(max_length=255, blank=False)
    sender = models.CharField(max_length=255, blank=False)
    reciever = models.CharField(max_length=255, blank=False)
    amount = models.DecimalField(decimal_places=2, max_digits=10, default=0)

    class Meta:
        ordering = ["-id"]
