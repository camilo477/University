from django.db import models

class Course(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    professor = models.CharField(max_length=100)
    schedule = models.CharField(max_length=50)

    def _str_(self):
        return self.name 