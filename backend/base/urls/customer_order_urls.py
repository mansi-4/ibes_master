from django.urls import path
from base.views import customer_order_views as views
urlpatterns=[
   path("",views.getCustomerOrders,name="all-orders"),
   path("add/",views.addOrderItems,name="orders-add"),
   path("<str:pk>/",views.getCustomerOrderById,name="customer-order-by-id"),
]